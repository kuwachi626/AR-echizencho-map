AFRAME.registerComponent("camera-look", {

    tick: function () {
        // カメラのエンティティを取得
        var camera = document.querySelector("#camera");
    
        // カメラと画像の3D空間における位置を取得
        var cameraPosition = new THREE.Vector3();
        var imagePosition = new THREE.Vector3();
    
        // カメラと画像のワールド空間の位置を取得
        camera.object3D.getWorldPosition(cameraPosition);
        this.el.object3D.getWorldPosition(imagePosition);
    
        // 画像をカメラの位置に向ける
        this.el.object3D.lookAt(cameraPosition);
    }
});
