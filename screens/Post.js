import React from "react";
import { View, Text, StyleSheet, Image, FlatList,TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import Fire from "../Fire";
import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Post extends React.Component {
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
                    .doc(post.name)
                    .collection("myposts")
                    .doc(post.timestamp.toString())
                    .update({comment:comments})
            this.inputRef.clear()
        }
        
    }
    
    render() {

        Fire.shared.firestore
            .collection('posts')
            .doc(this.props.post.name)
            .get()
            .then(doc =>{
                const {profile} = doc.data()
                this.setState({profilePhoto:profile})
                
                }
            )

        let postAvatar={uri:this.state.profilePhoto}
        let imageUrl={uri:this.props.post.image}
        const likedButtonValue = this.props.post.liked?"ios-heart":"ios-heart-empty"

        let b =[]
        if(this.props.post.comment){
            this.props.post.comment.forEach(element => b.push(element))
        }
        
        return (
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("PostDetail", {post:this.props.post})}>
                <View style={styles.feedItem}>
                    
                    <Image source={postAvatar} style={styles.avatar} />
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
                        
                        <FlatList
                            data={b}
                            renderItem={({item}) => this.renderComment(item,this.props.post)}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                        /> 
                        
                        
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
  }

const styles = StyleSheet.create({

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
