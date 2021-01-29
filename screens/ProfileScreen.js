import React from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity,Image, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import firebase from 'firebase';
import Fire from "../Fire";

export default class ProfileScreen extends React.Component {
    state = {
        image: ""
    };

    componentDidMount() {
        this.getPhotoPermission();
        this.getProfilePhoto();
    }

    getPhotoPermission = async () => {
        
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (status != "granted") {
            alert("permission needed");
        }
        
    };

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
            Fire.shared.addProfilePhoto(this.state.image)
        }
    };

    getProfilePhoto= ()=>{
       
        Fire.shared.firestore
            .collection('posts')
            .doc(firebase.auth().currentUser.displayName)
            .get()
            .then(doc =>{
                const {profile} = doc.data()
                this.setState({image:profile})
                
                }
                
            )
       
    }

    signOutUser = () => {
        firebase.auth().signOut();
    };
    render(){
        let url={uri:this.state.image}
        
        return (

            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.titleBar}>
                        <TouchableOpacity onPress={this.signOutUser}>
                            <Text style={{left:50}}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
    
                    <View style={{ alignSelf: "center" }}>
                        <View style={styles.profileImage}>
                            <Image source={this.state.image?url:require("../assets/loginLogo.png")} style={{ width: "100%", height: "100%" }} resizeMode="center"></Image>
                        </View>
                        
                        <View style={styles.active}></View>
                        <View style={styles.add}>
                            <TouchableOpacity onPress={this.pickImage}>
                                <Ionicons name="ios-add" size={48} color="#DFD8C8" style={{ marginTop: 6, marginLeft: 2 }}></Ionicons>
                            </TouchableOpacity>
                            
                        </View>
                    </View>
    
                    <View style={styles.infoContainer}>
                        <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>{firebase.auth().currentUser.displayName}</Text>
                        
                    </View>
    
                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={[styles.text, { fontSize: 24 }]}>0</Text>
                            <Text style={[styles.text, styles.subText]}>Posts</Text>
                        </View>
                        <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                            <Text style={[styles.text, { fontSize: 24 }]}>0</Text>
                            <Text style={[styles.text, styles.subText]}>Followers</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={[styles.text, { fontSize: 24 }]}>0</Text>
                            <Text style={[styles.text, styles.subText]}>Following</Text>
                        </View>
                    </View>
    
                    <View style={{ marginTop: 32 }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={styles.mediaImageContainer}>
                                <Image source={require("../assets/media1.jpg")} style={styles.image} resizeMode="cover"></Image>
                            </View>
                            <View style={styles.mediaImageContainer}>
                                <Image source={require("../assets/media2.jpg")} style={styles.image} resizeMode="cover"></Image>
                            </View>
                            <View style={styles.mediaImageContainer}>
                                <Image source={require("../assets/media3.jpg")} style={styles.image} resizeMode="cover"></Image>
                            </View>
                        </ScrollView>
                        
                    </View>
                   
                    
                </ScrollView>
            </SafeAreaView>
        );
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginHorizontal: 16
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden",
        backgroundColor:"#D3D3D3"
    },
    dm: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 28,
        left: 10,
        padding: 4,
        height: 20,
        width: 20,
        borderRadius: 10
    },
    add: {
        backgroundColor: "#41444B",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    mediaImageContainer: {
        width: 180,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginHorizontal: 10
    },
    recent: {
        marginLeft: 78,
        marginTop: 32,
        marginBottom: 6,
        fontSize: 10
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16
    },
    activityIndicator: {
        backgroundColor: "#CABFAB",
        padding: 4,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginTop: 3,
        marginRight: 20
    }
});