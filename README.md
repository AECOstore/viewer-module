# Mifesto: Viewer Module
This is a micro-frontend module that provides the means to interact with GlTF geometry in a federated ([Consolid](https://content.iospress.com/articles/semantic-web/sw233396)) multi-model. Once a project is activated, any GlTF geometry in the project will be discovered via its metadata description. The user can then select the geometry to be loaded into the viewer. The viewer is based on [xeokit](https://xeokit.io/). Selection of a geometric element in the viewer will trigger a query to the Reference Registries in the multi-model, which will return the other representations of this element (e.g. pictures, point clouds, semantics). These representations can then be loaded in other modules. The inverse pattern also works: any selection made by another module that contains an element which is also present in the 3D model, will be highlighted in the viewer. The below image shows this interaction, based on the [Visualisation&Query](https://raw.githubusercontent.com/AECOstore/RESOURCES/main/configurations/viz_query.ttl) configuration.

![3D viewer UI](public/module.png)

## About Mifesto
Mifesto (Micro-Frontend Store) is an experimental framework for federation of micro-frontends. It is a work in progress and is not yet ready for production use. Micro-frontend modules expose the following: 

* a manifest file that describes the module and its dependencies
* loadable code which may be injected into a "bundler" application

The bundler application is responsible for loading the micro-frontend modules and providing a framework for them to interact with each other. The bundler application is also responsible for providing an interface for the micro-frontend modules to render into. Mifesto modules may or may not be compatible with the [ConSolid ecosystem](https://content.iospress.com/articles/semantic-web/sw233396), or generally with AEC multi-models. To be useful for interacting with multi-models, a minimal functionality is required. This functionality is described in the [Mifesto documentation]().