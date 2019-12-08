const ASSET_NAMES = [
    'img_ship.png',
    'img_ship_me.png',
    'img_bullet.png',
    'red_dot.png',
    'dot.png',
    'ship1.png',
    'ship7.png',
    'healthpack.png',
    'asteroid.png',
    '1.png',
    '2.png'

];
  
const assets = {};
  
const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
    return new Promise(resolve => {
        const asset = new Image();
        asset.onload = () => {
            console.log(`Downloaded ${assetName}`);
            assets[assetName] = asset;
            resolve();
        };
        asset.src = `/assets/${assetName}`;
    });
}
  
export const downloadAssets = () => downloadPromise;

export const getAsset = assetName => assets[assetName];
