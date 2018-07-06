/**
 * Created by hxn 2017.12.09
 */
'use strict';

// const neo4j = require('neo4j-driver').v1;
// const driver = neo4j.driver(config.neo4j.uri, neo4j.auth.basic(config.neo4j.user, config.neo4j.password));
const driver = config.neo4jDriver

/**
 * 提交网络流量关系数据。
 */
exports.add = async (ctx) => {
    try {
        var req_body = ctx.request.body
        var uid = req_body["Uid"]
        const session = driver.session()

        var networkFlows = req_body["NetworkFlows"]
        // console.log(ctx.request.body)
        for (let i = 0; i < networkFlows.length; i++) {
            const relation = networkFlows[i]
            var result = await searchFlow(session, relation)
            console.log(relation)
            if (result["records"].length <= 0) {
                console.log("there is no relation")
                var res2 = await addFlow(session, relation)
            } else {
                console.log("there is a relation")
            }
        } // end of for
        ctx.body = {
            "status": "success"
        }
    } catch (e) {
        ctx.status = 400
        ctx.body = e.message
    }
}

/**
 * 查找一批节点的之间的关系
 */
exports.search = async (ctx) => {
    try {
        const session = driver.session()
        var req_body = ctx.request.body
        var links = await searchByUids(session, req_body["uids"])

        ctx.body = {
            "status": "success",
            "links": links
        }
    } catch (error) {
        ctx.status = 400
        ctx.body = {
            "status": "error",
            "message": error.message
        }
    }
}
/**
 * 共有多少条关系
 */
exports.count = async (ctx) => {
    try {
        const session = driver.session()
        var linksCount = await linkCount(session)
        ctx.body = {
            "status": "success",
            "linksCount": linksCount
        }
    } catch (error) {
        ctx.status = 400
        ctx.body = {
            "status": "error",
            "message": error.message
        }
    }
}
/**
 * 获取关系数据
 */
exports.fetchLinks = async (ctx) => {
    try {
        
        var req_body = ctx.request.body
        var skip = req_body["skip"] ? req_body["skip"] : 0
        var limit = req_body["limit"] ? req_body["limit"] : 10

        const session = driver.session()
        // var links = await fetchLinks(session)

        const result = await session.writeTransaction(tx => tx.run(
            'MATCH (n)-[r]-(m) RETURN r skip $skip limit $limit', { skip: skip,limit:limit}))
        var records = result["records"]
        var links = []
        if (records.length > 0) {
            for (var i = 0; i < records.length; i++) {
                var link = records[i].toObject()["r"]
                var link = {
                    "identity": link.identity.toString(),
                    "source": link.start.toString(),
                    "target": link.end.toString(),
                    "value": 1
                }
                links.push(link)
            }
        }

        ctx.body = {
            "status": "success",
            "links": links
        }
    } catch (error) {
        ctx.status = 400
        ctx.body = {
            "status": "error",
            "message": error.message
        }
    }
}

/**
 * Public methods
 */


/**
 * todo page
 * 
 */
// async function fetchLinks(neo4jSession) {
//     const result = await neo4jSession.writeTransaction(tx => tx.run(
//         'MATCH (n)-[r]-(m) RETURN r'))
//     var records = result["records"]
//     var links = []
//     if (records.length > 0) {
//         for (var i = 0; i < records.length; i++) {
//             var link = records[i].toObject()["r"]
//             var link = {
//                 "identity": link.identity.toString(),
//                 "source": link.start.toString(),
//                 "target": link.end.toString(),
//                 "value": 1
//             }
//             links.push(link)
//         }
//     }
//     return links
// }

/**
 * count
 */
async function linkCount(neo4jSession) {
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        'MATCH (n)-[r]-(m) RETURN count(r)'))
    var records = result["records"]
    var count = records[0].toObject()['count(r)'].toString()
    return count
}

/**
 * 通过多个UID查找是否为已经存储的关系
 * @param {*} NetRelations 
 */
async function searchByUids(neo4jSession, uids) {
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        'MATCH((anode)-[r]-(bnode))' +
        'WHERE( anode.uid in $uids and bnode.uid in $uids)' +
        'RETURN r', {
            "uids": uids
        }))
    var links = []
    if (result.records.length > 0) {
        for (var i = 0; i < result.records.length; i++) {
            var relation = result.records[i].toObject()["r"]
            var relation_new = {
                "identity": relation.identity.toString(),
                "source": relation.start.toString(),
                "target": relation.end.toString(),
                "value": 1
            }
            links.push(relation_new)
        }
    }
    return links
}

/**
 * 通过两个ip查找是否为已经存储的关系
 * @param {*} NetRelations 
 */
async function searchFlow(neo4jSession, flow) {
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        'MATCH((anode)-[tcp]-(bnode))' +
        'WHERE($SrcIp in anode.ips and $DstIp in bnode.ips)' +
        'RETURN bnode', {
            "SrcIp": flow["SrcIp"],
            "DstIp": flow["DstIp"]
        }))
    return result
}

/**
 * 新建一个未存储的关系
 * @param {*} NetRelations 
 */
async function addFlow(neo4jSession, relation) {
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        'MATCH(a), (b) ' +
        'where $SrcIp in a.ips and $DstIp in b.ips ' +
        'CREATE(a)-[r:tcp{count:0}]->(b)' +
        'RETURN r', {
            "SrcIp": relation["SrcIp"],
            "DstIp": relation["DstIp"]
        }))
    console.log(relation)
    return result
}


function getUniqIpsNetRelations(NetRelations) {
    var ips = []
    for (let i = 0; i < NetRelations.length; i++) {
        const relation = NetRelations[i]
        const SendIp = relation["SendIp"]
        if (ips.indexOf(SendIp) == -1) {
            ips.push(SendIp)
        }
        const ReceiverIp = relation["ReceiverIp"]
        if (ips.indexOf(ReceiverIp) == -1) {
            ips.push(ReceiverIp)
        }
    }
    return ips
}