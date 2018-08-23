/**
 * Created by hxn 2017.12.09
 */
'use strict';

const driver = config.neo4jDriver
// const session = driver.session();


/**
 * 新增或者更新主机节点数据 返回原生neo4j的返回值。
 */
exports.add_or_update = async (ctx) => {
    var req_body = ctx.request.body
    var hostname = req_body["Hostname"]
    var uid = req_body["Uid"]
    var ips = req_body["Ips"]
    var unixTime = req_body["UnixTime"]

    const session = driver.session();
    
    var params = {
        hostname: hostname,
        uid: uid,
        ips: ips,
        updateTime: unixTime
    }
    const result = await session.writeTransaction(tx => tx.run(
        'MERGE (node:host{uid:$uid}) ' +
        'ON CREATE SET node.hostname = $hostname , node.ips=$ips, node.time=$updateTime ' +
        'ON MATCH SET node.hostname = $hostname , node.ips=$ips, node.time=$updateTime ' +
        'RETURN node', params))

    session.close()
    ctx.body = {
        "status": "success",
        "message": "Add " + result.records.length + " host."
    }
}

/**
 * host search by tag ip hostname ...
 */
exports.search = async (ctx) => {
    const session = driver.session()
    var req_body = ctx.request.body

    var skip = req_body["skip"] ? req_body["skip"] : 0
    var limit = req_body["limit"] ? req_body["limit"] : 10
    var tag = req_body["tag"]
    var ip = req_body["ip"]
    var hostname = req_body["hostname"]

    var nodes = []
    var params = {
        'ip': ip,
        'skip': skip,
        'limit': limit
    }
    var where_statement = ' where 1=1 '
    if (tag) {
        where_statement += ' AND $tag in node.tags '
        params['tag'] = tag
    }
    if (ip) {
        where_statement += ' AND $ip in node.ips '
        params['ip'] = ip
    }
    if (hostname) {
        where_statement += " AND node.hostname =~'.*" + hostname + ".*'  "
        params['hostname'] = hostname
    }
    var statement = 'match(node) ' + where_statement + ' return node SKIP $skip LIMIT $limit'
    console.debug(statement)
    const result = await session.writeTransaction(tx => tx.run(statement, params))

    var records = result["records"]
    var nodes = []
    if (records.length > 0) {
        for (var i = 0; i < records.length; i++) {
            var node = records[i].toObject()["node"]
            var node_new = {
                "identity": node.identity.toString(),
                "labels": node.labels,
                "properties": node.properties
            }
            nodes.push(node_new)
        }
    }


    ctx.body = {
        "status": "success",
        "nodes": nodes
    }
}

/**
 * 通过中心节点和深度搜索节点数据
 */
exports.searchNodesByIdNDeepth = async (ctx) => {
    const session = driver.session();
    var req_body = ctx.request.body
    console.log(req_body)
    var identity = req_body["identity"]
    var deepth = req_body["deepth"]

    var nodes = await fetchNodesByIdNDeepth(session, identity, deepth)
    ctx.body = {
        "status": "success",
        "nodes": nodes
    }
}

/**
 * 通过uid列表搜索节点数据
 */
exports.searchByUids = async (ctx) => {
    const session = driver.session();
    var req_body = ctx.request.body
    console.log(req_body)
    var uids = req_body["uids"]

    var nodes = await searchByUids(session, uids)

    ctx.body = {
        "status": "success",
        "nodes": nodes
    }
}

/**
 * 共有多少个节点
 */
exports.count = async (ctx) => {
    const session = driver.session();
    var count = await nodeCount(session)

    ctx.status = 200
    ctx.body = {
        "status": "success",
        "node_count": count
    }
}

/**
 * 更新节点的tags
 */
exports.updateTags = async (ctx) => {
    try {
        var req_body = ctx.request.body
        const session = driver.session();
        const result = await session.writeTransaction(tx => tx.run(
            'match(node) where node.uid=$uid set node.tags=$tags return count(node)', req_body))
        var records = result["records"]
        var count = records[0].toObject()['count(node)'].toString()
        ctx.status = 200
        ctx.body = {
            "node_count": count
        }
    } catch (error) {
        console.error(error.stack)
        ctx.status = 400
        ctx.body = {
            "status": "error",
            "message": error.message
        }
    }
}

/**
 * delete multi hosts
 */

exports.delete = async (ctx) => {
    var req_body = ctx.request.body
    var uids = req_body["uids"]
    if (uids == undefined) {
        throw new Error("Param uids is required.");
    } else if (uids.length == 0) {
        throw new Error("Param uids should not be empty.");
    }

    const session = driver.session();
    //Delete node and links
    session.run('MATCH (anode)-[link]-(bnode)  WHERE anode.uid IN $uids  DELETE anode,link', {
    // session.run('MATCH (anode)-[link]-(bnode)  WHERE anode.uid IN $uids  RETURN anode,link', {
        uids: uids
    }).then(function (result) {
        console.log(result);
    }).catch(function (error) {
        throw error;
        console.error(error);
    })
    
    //Delete node only 
    session.run('MATCH (anode)  WHERE anode.uid IN $uids  DELETE anode', {
        uids: uids
    }).then(function (result) {
        console.log(result);
        session.close();
    }).catch(function (error) {
        throw error;
        console.error(error);
    })

    ctx.body = {
        "status": "success",
        "message": "Delete " + uids.length + " nodes.",
    }
}



/**
 * 公共方法
 * 
 * 
 * 
 * 
 */


/**
 * 查找是否已经存在这个节点
 */
async function searchNode(neo4jSession, uid) {
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        'match(host{ uid: $uid })return host', {
            "uid": uid
        }))
    neo4jSession.close()
    return result
}

/**
 * 新增新的节点
 */
async function addNode(neo4jSession, newNode) {
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        'CREATE ($param)', {
            "param": newNode
        }));
    neo4jSession.close()
    return result
}

/**
 * count
 */
async function nodeCount(neo4jSession) {
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        'match(node) return count(node)'))
    var records = result["records"]
    var count = records[0].toObject()['count(node)'].toString()
    neo4jSession.close()

    return count
}
/**
 * 通过IP查找一个节点
 */
async function searchByIp(neo4jSession, ip) {
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        'match(node) where $ip in node.ips return node', {
            "ip": ip
        }))
    var records = result["records"]
    var nodes = []
    if (records.length > 0) {
        for (var i = 0; i < records.length; i++) {
            var node = records[i].toObject()["node"]
            var node_new = {
                "identity": node.identity.toString(),
                "labels": node.labels,
                "properties": node.properties
            }
            nodes.push(node_new)
        }
    }
    neo4jSession.close()

    return nodes
}

/**
 * 通过uids查找一个节点
 */
async function searchByUids(neo4jSession, ips) {
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        'match(node) where node.uid in $ips return node', {
            "ips": ips
        }))
    var records = result["records"]
    var nodes = []
    if (records.length > 0) {
        for (var i = 0; i < records.length; i++) {
            var node = records[i].toObject()["node"]
            var node_new = {
                "identity": node.identity.toString(),
                "labels": node.labels,
                "properties": node.properties
            }
            nodes.push(node_new)
        }
    }
    neo4jSession.close()

    return nodes
}
/**
 * 所有节点
 */
async function allHost(neo4jSession) {
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        'match(node) return node'))
    var records = result["records"]
    var nodes = []
    if (records.length > 0) {
        for (var i = 0; i < records.length; i++) {
            var node = records[i].toObject()["node"]
            var node_new = {
                "identity": node.identity.toString(),
                "labels": node.labels,
                "properties": node.properties
            }
            nodes.push(node_new)
        }
    }
    neo4jSession.close()

    return nodes
}

/**
 * 通过id和深度来获取一批nodes
 */
async function fetchNodesByIdNDeepth(neo4jSession, identity, deepth) {
    var query_str = "MATCH(n)-[rel*1.." + deepth + "]-(node) \
        WHERE n.uid = $identity \
        RETURN node"
    const result = await neo4jSession.writeTransaction(tx => tx.run(
        query_str, {
            "identity": identity,
            "deepth": deepth
        }))
    var records = result["records"]
    var nodes = []
    if (records.length > 0) {
        for (var i = 0; i < records.length; i++) {
            var node = records[i].toObject()["node"]
            // console.log(node)
            var node_new = {
                "identity": node.identity.toString(),
                "labels": node.labels,
                "properties": node.properties
            }
            nodes.push(node_new)
        }
    }
    neo4jSession.close()

    return nodes
}