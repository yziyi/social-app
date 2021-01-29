import React from "react";
import { View, Text, StyleSheet, Image, FlatList,TextInput,TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import Fire from "../Fire";
import firebase from "firebase";

import Post from "./Post"
/**state = { email: "", displayName: "" };

    componentDidMount() {
        const { email, displayName } = firebase.auth().currentUser;

        this.setState({ email, displayName });
    }

    signOutUser = () => {
        firebase.auth().signOut();
    };
    **/



export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: "Home"
        /**title: this.props.navigation.state.params.name */
    };
    state = {
        posts:[],
        userNames:[],
        profilePhoto:null,
        refreshing:false,
        text:""
    }
    constructor(props) {
        super(props);
        this.userNames = []
        this.inputRef = null;
    }

    getUsers = ()=>{
        const userNames =[]
        Fire.shared.firestore
            .collection('posts')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const {name} = doc.data();
                    userNames.push(name)
                });
                this.setState({userNames})
                this.state.userNames.forEach(name=>{
                    this.getPosts(name)
                })
                
            });
    }

    getProfilePhoto= ()=>{
        Fire.shared.firestore
            .collection('posts')
            .doc(firebase.auth().currentUser.displayName)
            .get()
            .then(doc =>{
                const {profile} = doc.data()
                this.setState({profilePhoto:profile})
                
                }
            )
            
       
    }

    likeToggled = (post) =>{
        this.setState({liked:!post.liked})
        const liked = !post.liked
        Fire.shared.firestore
                .collection("posts")
                .doc(firebase.auth().currentUser.displayName)
                .collection("myposts")
                .doc(post.timestamp.toString())
                .update({liked:liked})
        this.state.posts[this.state.posts.findIndex((obj => obj.key == post.timestamp))].liked = liked    
         
    }

    delete = (post)=>{
        posts = this.state.posts.filter(item => item !== post)
        this.setState({posts:posts})
    }

    getPosts = (name) =>{
        let p = [] 
        
        Fire.shared.firestore
        .collection('posts')
        .doc(name)
        .collection('myposts')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const {text, uid, timestamp, image, liked, comment, name} = doc.data();
                p.push({
                    text: text,
                    key: timestamp.toString(),
                    name:name,
                    timestamp:timestamp,
                    image:image,
                    avatar: this.state.profilePhoto,
                    liked:liked,
                    comment:comment
                }); 
            });
            
            p = p.concat(this.state.posts)
            this.setState({posts:p})
        }); 
        this.setState({refreshing:false})    
        
    };

    
    componentDidMount(){
        this.getUsers()
        this.getProfilePhoto()
        
        
    };

    handleRefresh =() =>{
        this.setState({
            refreshing:true
        },()=>{
            this.setState({posts:[]})
            this.state.userNames.forEach(name=>{
                this.getPosts(name)
            })
            this.getProfilePhoto()
        })
    }
      
    render(){

        let b =[]
        this.state.posts.forEach(element => b.push(element))
        return (
            
            <View style={styles.container}>
                {
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Home</Text>
                </View> }
                <FlatList
                    style={styles.feed}
                    data={b}
                    renderItem={({ item, index }) => (
                        <Post key={index} post={item} navigation={this.props.navigation} delete={this.delete} likeToggled={this.likeToggled} posts={this.state.posts} />
                      )}
                    
                    showsVerticalScrollIndicator={false}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                />
            </View>
            
        );
    }
    

    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EBECF4"
    },
    header: {
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "500"
    },
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8
    },
    
});
