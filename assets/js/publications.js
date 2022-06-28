let publications = [
    'wu2022diver',
    'lee2021patchmatchrl',
    'lee2021patchmatch',
    'lin2019exploring',
    'degol2018feats',
]
const publicationContainer = document.querySelector("#publication-list > tbody")

const createPublicationCard = async (publication) => {
    const bibtex = await (await fetch(`/assets/publications/${publication}/cite.bib`)).text();
    const rawContents = await (await fetch(`/assets/publications/${publication}/index.yaml`)).text();
    const contents = jsyaml.load(rawContents);
    const teaser = `/assets/publications/${publication}/teaser.png`
    const template = document.querySelector('#template-container > .publication-template');
    const container = template.content.cloneNode(true);
    container.tag

    // img
    const teaserImage = container.querySelector('.publication-preview-container > img');
    teaserImage.src = teaser;

    // title
    const titleContainer = container.querySelector('.publication-title > a');
    titleContainer.href = contents.url ? contents.url : '#';
    titleContainer.innerHTML = contents.title;

    const authorContainer = container.querySelector('.publication-authors');
    authorContainer.innerHTML = contents.authors.join(', ');
    const venueContainer = container.querySelector('.publication-venue');
    venueContainer.innerHTML = contents.venue;
    const oralSpan = container.querySelector('.publication-venue-oral');
    oralSpan.style.display = contents.oral ? 'inline-block' : 'none';
    const bestSpan = container.querySelector('.publication-venue-best');
    bestSpan.style.display = contents.best ? 'inline-block' : 'none';
    const bestFinalSpan = container.querySelector('.publication-venue-best-final');
    bestFinalSpan.style.display = contents.best_final ? 'inline-block' : 'none';


    const linkContainer = container.querySelector('.publication-links')
    contents.links.forEach(linkCont => {
        const name = Object.keys(linkCont)[0];
        const link = Object.values(linkCont)[0];
        if (link) {
            linkAnchor = document.createElement('a');
            linkAnchor.href = link;
            linkAnchor.innerHTML = name;
            linkContainer.appendChild(linkAnchor);
            const span = document.createElement('span')
            span.innerHTML = '&nbsp/&nbsp';
            linkContainer.appendChild(span)
        }
    })
    bibtexAnchor = document.createElement('a');
    bibtexAnchor.href = `/assets/publications/${publication}/cite.bib`;
    bibtexAnchor.download = `${publication}.bib`;
    bibtexAnchor.innerHTML = 'bibtex';
    linkContainer.appendChild(bibtexAnchor)

    const descContainer = container.querySelector('.publication-description')
    descContainer.innerHTML = contents.description

    return container;
}

const fetchAllPublications = async () => {
    // setup loading icon

    const cards = await Promise.all(publications.map(async publication => {
        return await createPublicationCard(publication);
    }));

    cards.forEach(card => publicationContainer.appendChild(card));
    // remove loading icon
}
fetchAllPublications()