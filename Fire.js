
import firebase from "firebase";

const FirebaseKeys = {
    apiKey: "AIzaSyBJ12zAb3Ij91g4K-p5n-6U7MNEZPT34CU",
    authDomain: "app1-59b80.firebaseapp.com",
    databaseURL: "https://app1-59b80.firebaseio.com",
    projectId: "app1-59b80",
    storageBucket: "app1-59b80.appspot.com",
    messagingSenderId: "1079628636990",
    appId: "1:1079628636990:web:e1a9c67913657b48b5026f",
    measurementId: "G-0GLTVYD774"
};


class Fire {
    constructor() {
        firebase.initializeApp(FirebaseKeys);
    }

    

    addPost = async ({ text, localUri }) => {
        remoteUri = null
        if (localUri){
            remoteUri = await this.uploadPhotoAsync(localUri);
        }

        return new Promise((res, rej) => {
            this.firestore
                .collection("posts")
                .doc(firebase.auth().currentUser.displayName)
                .collection("myposts")
                .doc(this.timestamp.toString())
                .set({
                    text,
                    uid: this.uid,
                    timestamp: this.timestamp,
                    image: remoteUri,
                    liked:false,
                    comment:[],
                    name:firebase.auth().currentUser.displayName
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    addProfilePhoto = async imageUri => {
        imageUri = await this.uploadPhotoAsync(imageUri);
        return new Promise((res, rej) => {
            this.firestore
                .collection("posts")
                .doc(firebase.auth().currentUser.displayName)
                .update({
                    profile:imageUri
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    

    uploadPhotoAsync = async uri => {
        const path = `photos/${this.uid}/${Date.now()}.jpg`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(path)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => {},
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    

    

    
    
    get firestore() {
        return firebase.firestore();
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;

