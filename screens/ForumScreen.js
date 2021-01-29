import React from "react";
import { View, Text, StyleSheet, Image, FlatList,TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import Fire from "../Fire";
import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

/**state = { email: "", displayName: "" };

    componentDidMount() {
        const { email, displayName } = firebase.auth().currentUser;

        this.setState({ email, displayName });
    }

    signOutUser = () => {
        firebase.auth().signOut();
    };
    **/
class Post extends React.Component {
    state={
        text:""
    }
    constructor(props) {
      super(props);
      this.inputRef = null;
    }

    renderComment = (comment, post) =>{
        return(
        <Text>{post.name+": "+ comment}</Text>
        )
    }

    submit=(post)=>{
        if(this.state.text){
            let comments = post.comment
            comments.push(this.state.text)
            this.setState({comment:comments})
            Fire.shared.firestore
                    .collection("posts")
                    .doc(firebase.auth().currentUser.displayName)
                    .collection("myposts")
                    .doc(post.timestamp.toString())
                    .update({comment:comments})
            this.inputRef.clear()
        }
        
    }

    render() {
        let AvatarUrl={uri:this.props.post.avatar}
        let imageUrl={uri:this.props.post.image}
        const likedButtonValue = this.props.post.liked?"ios-heart":"ios-heart-empty"

        
        
        return (
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("PostDetail", {post:this.props.post})}>
                <View style={styles.feedItem}>
                    
                    <Image source={AvatarUrl} style={styles.avatar} />
                    <View style={{ flex: 1, }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View>
                                <Text style={styles.name}>{this.props.post.name}</Text>
                                <Text style={styles.timestamp}>{moment(this.props.post.timestamp).fromNow()}</Text>
                            </View>
                            <TouchableOpacity onPress={()=>{this.props.delete(this.props.post)}}>
                                <Ionicons name="ios-close" size={30} color="#73788B" />
                            </TouchableOpacity>
                            
                            
                        </View>
                        <Text style={styles.post}>{this.props.post.text}</Text>
                            {this.props.post.image? <Image source={imageUrl} style={styles.postImage} resizeMode="cover" /> : null}
                        <View style={{ flexDirection: "row", paddingTop:10}}>
                            <TextInput
                                style={styles.input}               
                                onChangeText={text => this.setState({text})}
                                ref={ref => {
                                    this.inputRef = ref;
                                }}
                                onSubmitEditing={()=>{this.submit(this.props.post)}}
                                />

                            <TouchableOpacity onPress={()=>{this.props.likeToggled(this.props.post)}} >
                                <Ionicons 
                                    name={likedButtonValue} 
                                    size={24} 
                                    color={"#73788B"} 
                                    style={{ marginRight: 16 }} 
                                />
                            </TouchableOpacity>

                            
                            <TouchableOpacity
                                onPress={() => {
                                    this.inputRef.focus();
                                }}>
                                <Ionicons name="ios-chatboxes" size={24} color="#73788B" />
                            </TouchableOpacity>
                        </View>
                        
                        
                        
                        
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
  }


export default class ForumScreen extends React.Component {
    static navigationOptions = {
        headerShown: false
        /**title: this.props.navigation.state.params.name */
    };
    state = {
        posts:[],
        profilePhoto:null,
        refreshing:false,
        text:""
    }
    constructor(props) {
        super(props);
        this.inputRef = null;
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

    getPosts = () =>{
        const p = [] 
        Fire.shared.firestore
        .collection('posts')
        .doc(firebase.auth().currentUser.displayName)
        .collection('myposts')
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const {text, uid, timestamp, image, liked, comment} = doc.data();
                p.push({
                    text: text,
                    key: timestamp.toString(),
                    name: firebase.auth().currentUser.displayName,
                    timestamp:timestamp,
                    image:image,
                    avatar: this.state.profilePhoto,
                    liked:liked,
                    comment:comment
                }); 
            });
            this.setState({posts:p, refreshing:false})
        });    
    };

    componentDidMount(){
        this.getProfilePhoto()
        this.getPosts()
    };

    handleRefresh =() =>{
        this.setState({
            refreshing:true
        },()=>{
            this.getPosts()
            this.getProfilePhoto()
        })
    }
      
    render(){
       
        let b =[]
        this.state.posts.forEach(element => b.push(element))
        return (
            
            <View style={styles.container}>
                
                <FlatList
                    style={styles.feed}
                    data={b}
                    renderItem={({ item, index }) => (
                        <Post key={index} post={item} navigation={this.props.navigation} delete={this.delete} likeToggled={this.likeToggled} posts={this.state.posts} />
                      )}
                    keyExtractor={(item, index) => index.toString()}
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
    
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16,
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65"
    },
    timestamp: {
        fontSize: 11,
        color: "#C4C6CE",
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: "#838899",
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16,
        
    },
    input: {
        width: 0,
        padding: 0,
      },
    
});
