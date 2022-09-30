import React, { useState, useEffect } from "react";
import Viewer from "./Viewer";
import { Catalog } from 'consolid-daapi'
import { ReferenceRegistry } from 'consolid-raapi'
import { Session } from '@inrupt/solid-client-authn-browser'

const LBDviewer = (props) => {
  const { piral } = props
  const constants = piral.getData("CONSTANTS")
  
  const [models, setModels] = useState(["http://localhost:3000/engineer/f177466f-5929-445f-b2d7-ee19576c7d3a"])
  const [dataset, setDataset] = useState("")
  const [selection, setSelection] = useState([])
  const [session, setSession] = useState(new Session())
  const [height, setHeight] = useState(600)

  async function onSelect(sel) {
    setSelection(sel)
    const alias = await findAliases(models[0], sel[0], props.state[constants.ACTIVE_PROJECT], props.state[constants.REFERENCE_REGISTRY], session)
    piral.setDataGlobal(constants.SELECTED_CONCEPTS, [alias])
  }

  async function findAliases(activeDocument, selectedElement, projectUrl, referenceRegistryUrl, activeSession) {
    const project = new Catalog(activeSession, projectUrl)
    const refReg = new ReferenceRegistry(activeSession, referenceRegistryUrl, project)
    const reference = await refReg.findConceptByIdentifier(activeDocument, selectedElement)
    return reference
  }

  function getCurrentSelection() {
    if (props.state[constants.SELECTED_CONCEPTS]) {
      return props.state[constants.SELECTED_CONCEPTS].map(item => item.references.filter((ref) => models.includes(ref.document))).flat().map(i => i.identifier)
    } else {
      return []
    }
  }

  return (
    <div>
      {(models.length) ? (
        <div>
          <Viewer
            height={height}
            models={models}
            projection={"perspective"}
            onSelect={onSelect}
            selection={getCurrentSelection()}
          />
        </div>
      ) : (
        <div>
          <p style={{ paddingTop: "10%" }}>No glTF models selected </p>
        </div>
      )}
    </div>
  );
};

export default LBDviewer;
