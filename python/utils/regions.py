regions = {
  "singapore": "ap-southeast-1",
  "sydney": "ap-southeast-2"
}

ec2_ids = {
  "singapore": {
    "t2.small": "ami-047126e50991d067b",
    "t3.medium": "ami-047126e50991d067b"
  },
  "sydney": {
    "t2.small": "ami-040e71e7b8391cae4",
    "t3.medium": "ami-040e71e7b8391cae4"
  }
}

core_region_name = "singapore"
core_region = regions["singapore"]