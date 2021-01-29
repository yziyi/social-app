import React from "react";
import { View, Text, StyleSheet, Image,FlatList} from "react-native";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";

const Random =()=>{
    return(
        <View>
            <Text> Random</Text>
        </View>
    )
}

export default class PostDetailScreen extends React.Component {
    renderComment = (comment, post, AvatarUrl) =>{
        return(
            <View>
                <View style={styles.feedItem}>   
                    <Image source={AvatarUrl} style={styles.avatar} />
                    
                    <View style={{ flex: 1, }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            
                            <Text style={styles.post}>{post.name+": "+ comment}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        let b =[]
        if(this.props.navigation.getParam("post").comment){
            this.props.navigation.getParam("post").comment.forEach(element => b.push(element))
        }
        let AvatarUrl={uri:this.props.navigation.getParam("post").avatar}
        let imageUrl={uri:this.props.navigation.getParam("post").image}
        return (
            <View style={styles.container}>
                <View style={styles.feedItem}>   
                    <Image source={AvatarUrl} style={styles.avatar} />
                    
                    <View style={{ flex: 1, }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View>
                                <Text style={styles.name}>{this.props.navigation.getParam("post").name}</Text>
                                <Text style={styles.timestamp}>{moment(this.props.navigation.getParam("post").timestamp).fromNow()}</Text>
                            </View>

                        </View>
                        <Text style={styles.post}>{this.props.navigation.getParam("post").text}</Text>
                            {this.props.navigation.getParam("post").image? <Image source={imageUrl} style={styles.postImage} resizeMode="cover" /> : null}
                        <View style={{ flexDirection: "row", paddingTop:10}}>       
                            <Ionicons name="ios-chatboxes" size={24} color="#73788B" />
                            
                        </View>

                        
                    </View>
               </View>
               <FlatList
                    data={b}
                    scrollEnabled={false}
                    renderItem={({item}) => this.renderComment(item,this.props.navigation.getParam("post"),AvatarUrl)}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}

                    />       
            </View>
            
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
      
    },
    feed: {
        marginHorizontal: 16
    },
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8,
        borderColor:"green"
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
});
