import { queryStringUtilities, fetchResults, transformUtilities } from './git_modules/nmvw-sparql-module/nmvw-sparql-module.mjs';

let url = 'https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-37/sparql';
const prefixes = {
	dc: '<http://purl.org/dc/elements/1.1/>',
	skos: '<http://www.w3.org/2004/02/skos/core#>',
	dct: '<http://purl.org/dc/terms/>',
	edm: '<http://www.europeana.eu/schemas/edm/>',
	rdf: '<http://www.w3.org/1999/02/22-rdf-syntax-ns#>',
	rdfs: '<http://www.w3.org/2000/01/rdf-schema#>',
};

// SPARQL query to get all photo objects, their creator, img path, title, and created day
const selectVars = ['?creator', '(COUNT(?creator) as ?creatorCount)'];
const whereQuery = [
	'<https://hdl.handle.net/20.500.11840/termmaster1397> skos:narrower* ?type .',
	'?obj edm:object ?type .',
	'?obj dc:creator ?creator .'
];
let queryOptionals = {
	group: '?creator',
	order: 'DESC(?creatorCount)'
};

let queryString = queryStringUtilities.createQueryString(prefixes, selectVars, whereQuery, queryOptionals);


fetchResults(url, queryString)
	.then((rawData) => transformUtilities.toMap(rawData))
	.then((data) => cleanCreatorNames(data))
	.then((objects) => {
		console.log(objects);
	});


function cleanCreatorNames(creators) {

	return creators.map((creator, index) => {

		let name = creator.get('creator');
		creator.set('creator', ++index);
		let gender = determineGender(name);

		creator.set('gender', gender[0]);	
		let genderLessName = gender[1];

		let titles = personTitle(genderLessName);
		creator.set('titles', titles[0]);
		let titleLessName = titles[1];


		creator.set('name', titleLessName);


		if(creator.get('gender') || creator.get('titles')) creator.set('person', true);
		else creator.set('person', false);

		return Object.fromEntries(creator);

	});
}


function determineGender(name) {
	let regex = RegExp(/^([Mm]evr||[Dd]hr)\. ?/);
	let male = RegExp(/([Dd]hr)/);
	let female = RegExp(/([Mm]evr.?)|([Mm]w.?)/);

	let genderTitleSplit = name.split(regex);

	let gender = new Set;

	if (genderTitleSplit.length > 1 && male.test(genderTitleSplit[1])) {
		gender.add('male');
		gender.add(genderTitleSplit[2]);
	}
	
	if (genderTitleSplit.length > 1 && female.test(genderTitleSplit[1])) {	
		gender.add('female');
		gender.add(genderTitleSplit[2]);
	}
	
	if (genderTitleSplit.length == 1 )	{
		gender.add(undefined);
		gender.add(genderTitleSplit[0]);
	}

	return Array.from(gender);

}


function personTitle(name) {
	let prof = RegExp(/^([Pp]rof)\.? ?/);
	let dr = RegExp(/^([Dd]r)\.? ?/);
	let drs = RegExp(/^([Dd]rs)\.? ?/);
	let ir = RegExp(/^([Ii]r)\.? ?/);

	let titles = new Set();

	let profSplit = name.split(prof);

	if(profSplit.length > 1 ) {
		profSplit.shift(); // removes the empty first value
		titles.add('Professor'); // add the title to the set
		name = profSplit[1]; // reassign the name without prof. 
	}

	let drSplit = name.split(dr);

	if(drSplit.length > 1 ) {
		drSplit.shift();
		titles.add('Doctor');
		name = drSplit[1]
	}

	let drsSplit = name.split(drs);

	if(drsSplit.length > 1 ) {
		drsSplit.shift();
		titles.add('Doctorandus');
		name = drsSplit[1]
	}

	let irSplit = name.split(ir);

	if(irSplit.length > 1 ) {
		irSplit.shift();
		titles.add('Ingenieur');
		name = irSplit[1]
	}

	if (titles.size > 0) return [Array.from(titles), name];
	else return [undefined, name];

}