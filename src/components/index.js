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
  const [associatedConcepts, setAssociatedConcepts] = useState({})
  const [activeModels, setActiveModels] = useState([])

  async function getModels() {
    const project = piral.getData(constants.ACTIVE_PROJECT)

    const results = await piral.getResourcesByContentType(project, "https://www.iana.org/assignments/media-types/model/gltf+json")
    setModels(results)
  }

  piral.on('store-data', ({ name, value }) => {
    if (name === constants.SELECTED_CONCEPTS) {
      const sel = value.map(item => item.references.filter((ref) => models.map(m => m.resource.value).includes(ref.document))).flat().map(i => i.identifier)
      setSelection(sel)
    }
  });

  async function onSelect(sel) {
    const project = piral.getData(constants.ACTIVE_PROJECT)
    const allReferences = []
    for (const model of Object.keys(associatedConcepts)) {
      const references = await piral.getAllReferences(associatedConcepts[model], sel, project)
      allReferences.push(references)
    }
    console.log('allReferences.flat() :>> ', allReferences.flat());
    piral.setDataGlobal(constants.SELECTED_CONCEPTS, allReferences.flat())
  }

  function setActive(data, model) {
    setActiveModels(prev => {
      if (prev.includes(model.resource.value)) {
        return prev.filter(item => item != model.resource.value)
      } else {
        return [...prev, model.resource.value]
      }
    })
    setAssociatedConcepts(prev => {
      if (Object.keys(prev).includes(model.resource.value)) {
        data = {...prev}
        delete data[model.resource.value]
        return data
      } else {
        return prev
      }
    })
  }

  async function getAssociatedConcepts(model) {
    const project = piral.getData(constants.ACTIVE_PROJECT)
    const data = await piral.getAssociatedConcepts(model.resource.value, project)
    setAssociatedConcepts(prev => {return {...prev, [model]: data}})
  }

  return (
    <div>
      <div>
    <Button onClick={() => getModels()} >Get GlTF models in project</Button>
      </div>
      <FormGroup>
      {models.map(model => {
        return <FormControlLabel key={model.resource.value} control={<Checkbox onChange={async (i) => {setActive(i, model); await getAssociatedConcepts(model)}}/>} label={model.resource.value} />
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
