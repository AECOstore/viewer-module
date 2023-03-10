import React, { useState, useEffect } from "react";
import Viewer from "./Viewer";
import {Button, FormGroup, FormControlLabel, Checkbox} from '@mui/material'

const LBDviewer = (props) => {
  const { piral } = props
  const constants = piral.getData("CONSTANTS")

  const [models, setModels] = useState([])
  const [dataset, setDataset] = useState("")
  const [selection, setSelection] = useState([])
  const [height, setHeight] = useState(300)

  const [activeModels, setActiveModels] = useState([])

  async function getModels() {
    const project = piral.getData(constants.ACTIVE_PROJECT)

    const results = await piral.getResourcesByContentType(project, "https://www.iana.org/assignments/media-types/model/gltf+json")
    setModels(results)
  }
  
  piral.on('store-data', ({ name, value }) => {
    if (name === constants.SELECTED_CONCEPTS) {
      const sel = value.map(item => item.references.filter((ref) => models.map(m => m.dUrl).includes(ref.document))).flat().map(i => i.identifier)
      setSelection(sel)
    }
  });

  async function onSelect(sel) {
    setSelection(sel)
    piral.setDataGlobal(constants.SELECTED_REFERENCES, [{activeDocument: models[0].dUrl, identifier: sel[0]}])
  }

  function setActive(data, model) {
    setActiveModels(prev => {
      if (prev.includes(model.dUrl.value)) {
        return prev.filter(item => item != model.dUrl.value)
      } else {
        return [...prev, model.dUrl.value]
      }
    })
  }


  return (
    <div>
      <div>
    <Button onClick={() => getModels()} >Get GlTF models in project</Button>
      </div>
      <FormGroup>
      {models.map(model => {
        return <FormControlLabel key={model.dUrl} control={<Checkbox onChange={(i) => setActive(i, model)}/>} label={model.dUrl.value} />
      })}
    </FormGroup>
      {(activeModels.length) ? (
        <div>
          <Viewer
            height={height}
            models={activeModels}
            projection={"perspective"}
            onSelect={onSelect}
            selection={selection}
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
