import * as THREE from 'three';

const paths = [
    { from:[38, 15, 20] , via: [0,12, -5], to: [-40, 10, -50] },
    { from:[38, 10, -10] , via: [0,10, -10], to: [-38, 10, -10] },
    { from:[38, 10, -10] , via: [0,10, -20], to: [-38, 15, -10] },
];

export const loadSeagullPath = ()=>{
    // Generate a path from the path details
    const path = paths[Math.floor(Math.random() * paths.length)];

    const from = new THREE.Vector3(...path.from);
    const via = new THREE.Vector3(...path.via);
    const to = new THREE.Vector3(...path.to);

    // Creating a CatmullRomCurve3 for a smooth curve
    const curve = new THREE.CatmullRomCurve3([from,via,to]);

    // (Optional) Set the curve type and tension if needed
    curve.curveType = 'centripetal';
    curve.tension = 0.5;
    // Use the curve to create geometry, e.g., a line
    const points = curve.getPoints(60 * 10 ); // Adjust the number of points for smoothness
    
    const directions =[]
    for (let i = 0; i < points.length - 1; i++) {
        const ratio = i == 0?0.0001:i/(points.length-1);
        const tangent = curve.getTangentAt(ratio).normalize();
        directions.push(points[i].clone().add(tangent));
    }
    return {positions:points,directions}
}

