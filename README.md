# Functional-programming
This repo is for the subject functional-programming from the Tech Track

## About this repo
This repo is my work for the subject `functional-programing` from the `tech-track` at the HvA. 

The goal for the subject is to create a visualization of data for the National Museum of World Cultures. 

![bubbles](https://github.com/iSirThijs/functional-programming/wiki/images/endresultScreen.png)

## Features and concept
This visualization is about the showing the photographic collection from the NVMW split out on the person who made the photo. The lager the bubble, the more items in the collection are from that creator.

The next subject will enhance this with interaction, allowing you to explore these creators and interact with the data(Coming later)

## Install

To install this app to your machine use:
```bash
git clone --recursive https://github.com/iSirThijs/functional-programming.git
```

*Optional*
If you want to use eslint (and don't have it global already): `run npm install`

> **Important** Opening the file in the browser will not work due to CORS issues with ES modules. Use a local webserver(or livereload plugin) to host the file at localhost. (I Used [Prepros](https://prepros.io))

## Data from NMVW

## Empty
There were no empty values except from objects from which the creator is unknown. These objects are grouped under one unknown group.

### SPARQL
The dataset used is from the [NMVW](http://museumovermensen.nl). It is retrieved using a sparql query. How this works can be found on the wiki page: [Let's SPARQL]([https](https://github.com/iSirThijs/functional-programming/wiki/data_sparql_query))

### Data transformation and cleaning
This is an excerpt from how the returned data look like:

```json
{
  "head": {
    "link": [],
    "vars": [
      "catLabel",
      "cat"
    ]
  },
  "results": {
    "distinct": false,
    "ordered": true,
    "bindings": [
      {
        "catLabel": {
          "type": "literal",
          "value": "visserij"
        },
        "cat": {
          "type": "uri",
          "value": "https://hdl.handle.net/20.500.11840/termmaster2809"
        }
	  },
	  ...
	]
  }
}
```

This data has been transformed and cleaned. Checkout these pages on how I did it: 
* [Data Play-doh](https://github.com/iSirThijs/functional-programming/wiki/data_transform)
* [That's some dirty data](https://github.com/iSirThijs/functional-programming/wiki/data_cleaning)

The resulting object is this: 
```js
[
	{ 
		creator: "Ir. J.G. Ohler",
		creatorCount: "45", 
		name: "J.G. Ohler",
		titles: ["Ingenieur"]
	}
	{
		creator: "Drs. H.F.W. (Hendrik Frederik Willem) Bantje",
		creatorCount: "50", 
		name: "H.F.W. (Hendrik Frederik Willem) Bantje", 
		titles: ["Doctorandus"]
	},
	{
		creator: "Drs. D. (Dick) Jaeger", 
		creatorCount: "19", 
		name: "D. (Dick) Jaeger", 
		titles: ["Doctorandus"]
	},
	{
		creator: "Pater W. (Willem) Ahlbrinck",
		creatorCount: "6", 
		name: "Pater W. (Willem) Ahlbrinck", 
		titles: undefined
	},
	{
		creator: "P. (Paul) Spies",
		creatorCount: "173",
		name: "P. (Paul) Spies", 
		titles: undefined
	},
]
```

## Journal and documentation
The wiki of this repo has documentation about how certain parts work, background information about JS or coding and a journal with the work done.
Check it all on [the Wiki](https://github.com/iSirThijs/functional-programming/wiki)