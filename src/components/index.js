import React, { useState, useEffect } from "react";
import Viewer from "./Viewer";
import { Button, FormGroup, FormControlLabel, Checkbox, ClickAwayListener } from '@mui/material'

const LBDviewer = (props) => {
  const { piral } = props
  const constants = piral.getData("CONSTANTS")

  const [models, setModels] = useState([])
  const [dataset, setDataset] = useState("")
  const [selection, setSelection] = useState([])
  const [height, setHeight] = useState(600)
  const [associatedConcepts, setAssociatedConcepts] = useState({})
  const [activeModels, setActiveModels] = useState([])

  useEffect(() => {
    const value = piral.getData(constants.SELECTED_CONCEPTS)
    if (value) {
      let sel = value.map(i => i.references).flat()
      sel = sel.filter((ref) => activeModels.includes(ref.document)).map(i => i.identifier)
      setSelection(sel)
    }
  }, [activeModels])

  async function getModels() {
    const results = await piral.getResourcesByContentType(piral, ["https://www.iana.org/assignments/media-types/model/gltf+json"])
    const m = results.map(a => a.distribution)
    setModels(m)
  }

  piral.on('store-data', async ({ name, value }) => {
    if (name === constants.SELECTED_CONCEPTS) {
      console.log('value :>> ', value);
      const subset = Object.keys(value).map(i => {
        const item = value[i]
        const gltfRefs = []
        item.references.forEach(ref => {
          if (activeModels.includes(ref.source)) gltfRefs.push(ref.value)
        })
        return gltfRefs
      }).flat()

      console.log('subset :>> ', subset);
      // .map(item => item.identifier)
      setSelection(subset)
      // const results = await piral.getResourcesByContentType(project, "https://www.iana.org/assignments/media-types/model/gltf+json")
      // const m = new Set(value.map(item => item.references.map(m => m.document)).flat().filter(i => results.map(a => a.resource.value).includes(i)))
      // setModels(Array.from(m))
    }
  });

  async function onSelect(sel) {
    const referenceRegistries = await piral.getReferenceRegistries(piral)
    const sparql = piral.getData(constants.SPARQL_STORE)
    let references = {}
    for (const id of sel) {
      const reference = await piral.findCollectionBySelector(referenceRegistries, undefined, id, sparql)
      references = { ...references, ...reference }
    }
    piral.setDataGlobal(constants.SELECTED_CONCEPTS, references)
  }

  function setActive(data, model) {
    setActiveModels(prev => {
      if (prev.includes(model)) {
        return prev.filter(item => item != model)
      } else {
        return [...prev, model]
      }
    })
    // setAssociatedConcepts(prev => {
    //   if (Object.keys(prev).includes(model)) {
    //     data = { ...prev }
    //     delete data[model]
    //     return data
    //   } else {
    //     return prev
    //   }
    // })
  }

  async function getAssociatedConcepts(model) {
    const project = piral.getData(constants.ACTIVE_PROJECT)
    const data = await piral.getAssociatedConcepts(model, project)
    setAssociatedConcepts(prev => { return { ...prev, [model]: data } })
  }

  return (
    <div>
      <div>
        <Button onClick={() => getModels()} >Get GlTF models in project</Button>
      </div>
      <FormGroup>
        {(models.length) ? (
          <div>
            {/* <p>Active concepts were found in the following GLTF models. Open models?</p> */}
            {models.map(model => {
              return <FormControlLabel key={model} control={<Checkbox onChange={async (i) => { setActive(i, model)}} />} label={model} />
            })}
          </div>

        ) : (
          <></>
        )}

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
