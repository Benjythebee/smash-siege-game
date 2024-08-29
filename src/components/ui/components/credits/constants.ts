
export type CreditContent = {
    item:string,
    author:string,
    modified?:string,
    link:string
}

export const Credits:{
    content:CreditContent[],
    musicAudio:CreditContent[]
} = {
    content:[
        {
            item: 'Boulder',
            author: 'Google',
            link: 'https://poly.pizza/m/3jql0qtape-',
        },
        {
            item:'Seagull',
            author: 'Google',
            modified: 'Benjy Larcher',
            link: 'https://poly.pizza/m/6Tpj_vcWP3f'
        },
        {
            item:'Vine',
            author: 'Google',
            link: 'https://poly.pizza/m/eI7GSQpnVUL'
        },
        {
            item:'Large Rock',
            author:'Quaternius',
            link: 'https://poly.pizza/u/Quaternius'
        },
        {
            item:'Plant',
            author:'Quaternius',
            link: 'https://poly.pizza/u/Quaternius'
        },
        {
            item:'Rock one',
            author:'Quaternius',
            link: 'https://poly.pizza/u/Quaternius'
        },
        {
            item:'Rock Two',
            author:'Quaternius',
            link: 'https://poly.pizza/u/Quaternius'
        },
        {
            item:'Rock Two',
            author:'Quaternius',
            link: 'https://poly.pizza/u/Quaternius'
        },
        {
            item:'Slingshot',
            author:'Jarlan Perez',
            modified:'Benjy Larcher',
            link: 'https://poly.pizza/m/9cNT9Ng4ruE'
        },
        {
            item:'Water Shader',
            author:'MrDoob',
            link: 'https://github.com/mrdoob/three.js/blob/dev/examples/webgl_water.html'
        },
    ],
    musicAudio:[
        {
            item:'Fireside Tales, The Bards Tale, Crystal Caverns',
            author:'Darren Curtis',
            link:'https://www.darrencurtismusic.com/'
        },
        {
            item:'Wooshes',
            author:'pixabay',
            link:'https://pixabay.com/sound-effects/search/wooshes/'
        },{
            item:'Magic Poof',
            author:'Unknown',
            link:'https://mixkit.co/free-sound-effects/discover/poof/'
        }

    ]
}as const