const axios = require("axios");
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require("graphql");

const config = {
    auth: {
        username: "taubew.hfu",  //taubew userId = 77725698 / beckerth userId = 2193293313
        password: "geheim01"
    }
};
const KursType = new GraphQLObjectType({
        name: "Kurs",
        fields: () => ({
        authors: {type: GraphQLString},
        description: {type: GraphQLString},
        displayName: {type: GraphQLString},
        olatResourceId: {type: GraphQLString},
        displayname: {type: GraphQLString}, //für repo/entries
        key: {type: GraphQLString}
    })
});
const FolderType = new GraphQLObjectType({
    name: "Folder",
    fields: () => ({
        detailsName: {type: GraphQLString},
        courseNodeId: {type: GraphQLString},
        name: {type: GraphQLString}
    })
});
const FileType = new GraphQLObjectType({
    name: "File",
    fields: () => ({
        href: {type: GraphQLString},
        title: {type: GraphQLString},
        size: {type: GraphQLString}
    })
});
const ForumType = new GraphQLObjectType({
    name: "Forum",
    fields: () => ({
        key: {type: GraphQLString},
        title: {type: GraphQLString},
        body: {type: GraphQLString},
        author: {type: GraphQLString}
    })
});

const rootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        Kataloge: {
            type: new GraphQLList(KursType),
            resolve(){
                const felixKataloge = "https://felix.hs-furtwangen.de/restapi/repo/entries";
                return axios.get(felixKataloge, config)
                        .then(res => {
                        return res.data;
            });
            }
        },
        Katalog: {
            type: KursType,
            args:{
                key: {type: GraphQLString}
            },
            resolve(parentValue,args){
                const felixKatalog = "https://felix.hs-furtwangen.de/restapi/repo/entries/";
                return axios.get(felixKatalog + args.key, config)
                    .then(res => res.data);
            }
        },
        Kurse: {
            type: new GraphQLList(KursType),
            args:{
                userId: {type: GraphQLString}
            },
            resolve(parentValue, args){
                const felixMyCourses = `https://felix.hs-furtwangen.de/restapi/users/${args.userId}/courses/my`;
                return axios.get(felixMyCourses, config)
                        .then(res => {
                        console.log(res.data);
                        return res.data;
            });
            }
        },
        Kurs : {
            type: KursType,
            args:{
                key: {type: GraphQLString}
            },
            resolve(parentValue, args){
                const kurs = "https://felix.hs-furtwangen.de/restapi/repo/courses/";
                return axios.get(kurs + args.key, config)
                        .then(res => {
                            console.log(res.data);
                        return res.data
                    });
            }
        },
        Folders: {
            type: FolderType,
            args:{
                courseKey: {type: GraphQLString}
            },
            resolve(parentValue, args){
                const folder = `https://felix.hs-furtwangen.de/restapi/repo/courses/${args.courseKey}/elements/folder`;
                return axios.get(folder, config)
                    .then(res => {
                        console.log(res.data.folders);
                        return res.data.folders[0];
                    });
            }
        },
        Files: {
            type: new GraphQLList(FileType),
            args:{
                href: {type: GraphQLString},
                courseKey: {type: GraphQLString},
                courseNodeId: {type: GraphQLString}
            },
            resolve(parentValue, args){
                const files = args.href || `https://felix.hs-furtwangen.de/restapi/repo/courses/${args.courseKey}/elements/folder/${args.courseNodeId}/files`;
                return axios.get(files, config)
                    .then(res => {
                        console.log(res);
                        return res.data;
                    });
            }
        },
        Forum: {
            type: new GraphQLList(ForumType),
            args:{
                courseKey: {type: GraphQLString},
                courseNodeId: {type: GraphQLString}
            },
            resolve(parentValue, args){
                const files = args.href || `https://felix.hs-furtwangen.de/restapi/repo/courses/${courseKey}/elements/forum/${courseNodeId}/forum/threads`;
                return axios.get(files, config)
                    .then(res => {
                        console.log(res);
                        return res.data;
                    });
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: rootQuery
});