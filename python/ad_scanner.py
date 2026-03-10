import json

def scan_ad():

    data = {
        "domain_info":{
            "domain":"corp.local",
            "controller":"DC01",
            "forest":"corp.local"
        },

        "users":[
            {
                "Name":"vivek",
                "Enabled":True,
                "LastLogonDate":"2026-03-10"
            },
            {
                "Name":"admin",
                "Enabled":True,
                "LastLogonDate":"2026-03-09"
            },
            {
                "Name":"guest",
                "Enabled":False,
                "LastLogonDate":"-"
            }
        ],

        "groups":[
            {"Name":"Domain Admins"},
            {"Name":"IT Support"},
            {"Name":"HR"},
            {"Name":"Finance"}
        ]
    }

    print(json.dumps(data))

if __name__ == "__main__":
    scan_ad()