// db.createUser({ user: 'skybms', pwd: '12345678', roles: [{ role: 'readWrite', db:'skybms'}] })
// mongosh -u skybms -p 12345678 --authenticationDatabase skybms

ssh -i "sky_bms_server_key.pem" ec2-user@ec2-204-236-220-172.compute-1.amazonaws.com