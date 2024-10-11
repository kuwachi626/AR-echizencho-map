const imagePaths = [
    "img/Hakusan(nisitanaka)Shrine.jpg",
    "img/Hakusan(tanaka)Shrine.jpg",
    "img/HakusanShrine(housenzi).jpg",
    "img/hani.jpg",
    "img/HiyosiShrine.jpg",
    "img/InariShrine.jpg",
    "img/KehiShrine.jpg",
    "img/KofunPark.jpg",
    "img/KumanoShrine.jpg",
    "img/map.png",
    "img/SasamusiShrine.jpg",
    "img/YahataShrine(asahi).jpg",
    "img/YahataShrine(iwakai).jpg",
    "img/YasakaShrine.jpg",
    "rf/KasugaShrine_rf.jpg",
    "rf/kirinPark_rf.jpg",
    "rf/toubu1_rf.jpg"
];

// IndexedDBの初期化
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("imageDB", 1);
        request.onerror = () => reject("Database failed to open");
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("images")) {
            db.createObjectStore("images", { keyPath: "id" });
        }
        };
    });
}

// 画像がIndexedDBに存在するか確認
async function isImageInDB(id) {
    const db = await initDB();
    return new Promise((resolve) => {
        const transaction = db.transaction(["images"], "readonly");
        const store = transaction.objectStore("images");
        const request = store.get(id);

        request.onsuccess = () => {
        resolve(!!request.result); // データが存在すればtrue、なければfalseを返す
        };
        request.onerror = () => {
        resolve(false);
        };
    });
}

// 画像をURLからBase64に変換して保存
async function saveImageToDB(url, id) {
    const db = await initDB();

    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Data = reader.result;
                const transaction = db.transaction(["images"], "readwrite");
                const store = transaction.objectStore("images");

                const imageRecord = {
                id: id,
                data: base64Data
                };
                store.put(imageRecord);

                transaction.oncomplete = () => {
                console.log(`Image ${id} saved to IndexedDB`);
                };
                transaction.onerror = () => {
                console.error(`Error saving image ${id} to IndexedDB`);
                };
            };
            reader.readAsDataURL(blob);
        })
        .catch(err => {
            console.error(`Error fetching image ${url}: ${err}`);
    });
}

// IndexedDBから特定の画像を取得してsrcに設定
async function loadImageToAImage(id, elementId) {
    const db = await initDB();
    const transaction = db.transaction(["images"], "readonly");
    const store = transaction.objectStore("images");

    // 指定されたIDの画像を取得
    const request = store.get(id);

    request.onsuccess = function() {
        const record = request.result;
        if (record) {
        const imageSrc = record.data;
        // A-Frameのa-imageエンティティのsrcを設定
        document.querySelector(`#${elementId}`).setAttribute("src", imageSrc);
        console.log(`Image ${id} loaded and set to #${elementId}`);
        } else {
        console.log(`No image found in IndexedDB with id: ${id}`);
        }
    };

    request.onerror = function() {
        console.error(`Failed to load image with id ${id} from IndexedDB`);
    };
}

window.onload = async function() {
    for (const path of imagePaths) {
        const imageId = path.split('/').pop(); // pathの最後の部分を画像のIDとして使う（例: "image1.jpg"）
        const exists = await isImageInDB(imageId);
    
        if (!exists) {
            console.log(`Saving image ${imageId} to IndexedDB...`);
            saveImageToDB(path, imageId);
        } else {
            console.log(`Image ${imageId} already exists in IndexedDB.`);
        }
    }

    loadImageToAImage("hani.jpg", "linkImageHani");
    loadImageToAImage("KofunPark.jpg", "linkImageKohun");
    loadImageToAImage("kirinPark_rf.jpg", "linkImageKirin");
    loadImageToAImage("toubu1_rf.jpg", "linkImageToubu");
    loadImageToAImage("YasakaShrine.jpg", "linkImageYasaka");
    loadImageToAImage("InariShrine.jpg", "linkImageInari");
    loadImageToAImage("KehiShrine.jpg", "linkImageKehi");
    loadImageToAImage("KumanoShrine.jpg", "linkImageKumano");
    loadImageToAImage("KasugaShrine_rf.jpg", "linkImageKasuga");
    loadImageToAImage("HiyosiShrine.jpg", "linkImageHiyosi");
    loadImageToAImage("Hakusan(nisitanaka)Shrine.jpg", "linkImageHakusanNisitanaka");
    loadImageToAImage("Hakusan(tanaka)Shrine.jpg", "linkImageHakusanTanaka");
    loadImageToAImage("HakusanShrine(housenzi).jpg", "linkImageHakusanHousenzi");
    loadImageToAImage("YahataShrine(asahi).jpg", "linkImageYahataAsahi");
    loadImageToAImage("YahataShrine(iwakai).jpg", "linkImageYahataIwakai");
    loadImageToAImage("SasamusiShrine.jpg", "linkImageSasamusi");
    loadImageToAImage("map.png", "map");
};