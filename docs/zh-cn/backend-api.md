# Backend Api list
Not finished yet...
## Host
### `Add or update`
---
 Add or update a Node.  
- Url: `/host/add_or_update`  
- Method: post  
- Parameters : 
```
{ 
    Hostname: 'logstash',
    Uid: '4d9ffc0d-6109-5478-bd5c-b3dcca3ee7e7',
    Ips: [ '172.20.0.9' ],
    UnixTime: 1535028927 
}
```
- Response :
```
{
    status: 'success',
    message: 'Add 1 host.'
}
```


### `host/search`

url: '/host/search'
method: 'post'  
url: '/host/search/by/id/deepth'  
method: 'post'  

### `/host/search/by/uids`

url: '/host/search/by/uids'  
method: 'post'  

### `/host/count`

url: '/host/count'  
method: 'get'  

### `/host/updateTags`

url: '/host/updateTags'  
method: 'post'  


## Netflow
### `Add`
---
- Description: Add a link.  
- Url: `/netflow/add`  
- Method: post  
- Parameters : 
```
{
    Uid: '535e9de1-30dd-57b8-92ac-9e5f3e6eb58b',
    NetworkFlows: [{
            SrcIp: '172.20.0.4',
            DstIp: '192.168.3.20',
            SrcPort: -1,
            DstPort: 3000,
            ProcessName: '',
            PackagesPerSecond: 0.19958094568616921,
            Count: 4
        },
        {
            SrcIp: '172.20.0.4',
            DstIp: '172.20.0.10',
            SrcPort: -1,
            DstPort: 9100,
            ProcessName: '',
            PackagesPerSecond: 4.490571277938808,
            Count: 90
        }
    ],
    UnixTime: 1535030224
}
```
- Response :
```
{
    status: 'success'
}
```

### `/netflow/count`

url: '/netflow/count'  
method: 'get'  

### `/netflow/fetch`
url: '/netflow/fetch'
method: get