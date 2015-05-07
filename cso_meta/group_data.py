import json
from collections import defaultdict;
import codecs
import re
import os
import glob

def read_file(file_name):
    json_str = ""
    
    with codecs.open(file_name, "r", "utf-8") as open_file:
            json_str = open_file.read()
    try:
        json_file = json.loads(json_str)
    except:
        print file_name, " Not Availible"
        return False
    return json_file

def write_json(json_dict, file_name):
    with codecs.open(file_name, "w", "utf-8")as out_file:
       out_file.write(json.dumps(json_dict,
                                 ensure_ascii=False,
                                 sort_keys=True,
                                 indent=4, separators=(',',':'),
                                 encoding="utf-8"))

def group(json_obj):
    
    joins = defaultdict(list)
    files = defaultdict(list)
    for i, file_name in enumerate(json_obj):
        for key in file_name:
            for var in file_name[key]['meta']:
                joins[var].append(file_name[key]['meta'][var])
                files[var].append(key)
        write_json(joins, "joins.json")
        write_json(files, "files.json")

def geo_only(json_obj):
    names = [ "Province or County", "Constituency",
              "Province County or City", "Garda Region",
              "Regional Authority", "County and Region",
              "Province County or City","Place of Usual Residence",
              "Location of Place of Work","County and City",
              "Area of Residence of Bride","County of",
              "County of Usual Residence","County",
              "Towns by Size", "Region", "Regional Authority",
              "Garda Division", "Local Authority",
              "Region and County" ];
    
    files = defaultdict(list)
    for i, file_name in enumerate(json_obj):
        for key in file_name:
            for var in file_name[key]['meta']:
                if var in names:
                    files[var].append(key)
        write_json(files, "geo_only_updated.json")

        
#json_file = read_file("meta.json")
#geo_only(json_file)


def stat_by_set(path):
    """
    open all json-stat files in path create a json file 
    with the stats the key and file name as a value
    and file name as value and stat as key
    """
    stat = defaultdict(str)
    file_name = defaultdict(list)
    os.chdir(path)
    
    for files in glob.glob("*"):
        if files == "datasets.json" or files == "meta.json":
            continue
        print files
        json_obj = read_file(files)
        try:
            statistic = json_obj["dataset"]["dimension"]["Statistic"]["category"]["index"]
            for key in statistic:
                stat[key] = files
                file_name[files].append(key)
        except:
            print "error", files
    write_json(stat, "stat_by_set.json")
    write_json(file_name, "set_by_stat.json")

def stat_by_label(path):
    """
    create a json file with 
    key : Statistic name
    label: Statistic label
    """
    stat = defaultdict(str)
    file_name = defaultdict(list)
    os.chdir(path)
    
    for files in glob.glob("*"):
        if files == "datasets.json" or files == "meta.json":
            continue
        print files
        json_obj = read_file(files)
        try:
            statistic = json_obj["dataset"]["dimension"]["Statistic"]["category"]["index"]
            label     = json_obj["dataset"]["dimension"]["Statistic"]["category"]["label"]
            for key in statistic:
                #print key, label[key]
                stat[key] = label[key]
                #file_name[files].append(key)
        except:
            print "error", files
    write_json(stat, "stat_by_set.json")
    #write_json(file_name, "set_by_stat.json")

stat_by_label("/home/dave/cso_meta/cso_json/")    
def unit_by_stat(path):
    """
    open all json-stat files in path create a json file 
    with all the units as key and the statistic as value
    """
    base = defaultdict(list)
    os.chdir(path)
    
    for files in glob.glob("*"):
        if files == "datasets.json" or files == "meta.json":
            continue
        print files
        json_obj = read_file(files)
        try:
            units = json_obj["dataset"]["dimension"]["Statistic"]["category"]["unit"]
            for key in units:
                # the key here the statistic code which will be the value in the dict
                # base[units[key]]["Base"] gets the Base unit for the key
                #print key, units[key]
                my_key = units[key]["Base"]
                my_key = my_key.strip()
                print my_key
                base[my_key].append(key)
                #print base[units[key]["Base"]]
        except:
            print "error", files
    write_json(base, "unit_by_stat.json")

# creat a file contaning the base as key and statistic as value    
#unit_by_stat("/home/dave/cso_meta/cso_json/")

# create json containing Statistic as key file_name as value
# create json woth file_name as key Statistic value
#
#stat_by_set("/home/dave/cso_meta/cso_json/")

# display the units and number of statictics with that unit
#data = read_file("cso_json/unit_by_stat.json")
#for i, key in enumerate(data):
#    print key, len(data[key])
#print i
    

# create json for search feature
def simple_cluster(json_obj):
    file_list = read_file("files.json")
    titles = defaultdict(int)
    set_titles = read_file("cso_json/datasets.json")
    for key in json_obj:
        set_name = file_list[key]
        for sets in set_name:
            current_title = set_titles[sets]
            current_title = current_title.split(" ")
            for word in current_title:
                print word
                titles[word] += 1
    #for words in titles:
    #    if titles[words] > 20:
    #        print words, titles[word]
    #write_json(titles, "cluster.json")
        
#meta = read_file("files.json")
#simple_cluster(meta)
#geo_only(meta)


#files = read_file("files.json")
#features = []
#for key in files:
#    features.extend(key)

#print len(features)



######### work with the ed data
#for i, line in enumerate(towns_by_ed):
    #print i, line
    # dict key :name of town value :ed

    #dict key :ed value list of names

def town_ed(towns_by_ed):
    pass

def parse_cso_ed(town_by_ed):
    # each line comes from the cso like so
    # Rathdowney (ED 087 Rathsaran (pt.)), Co. Laois
    # return a tuple for("Rathdowney", "087", "Rathsarn", "Laois")
    # how about a json file with
    """{
         "087" : {
    		    "town" : "Rathdowney",
		     "ed"  : "Rathsaran",
    		     "county" : "Laois",
		     "identifires" :  ["Co. Laois"],
		     "area" : "pt"
		}, ...

Wexford Borough (ED 004 Wexford No. 1 Urban), Co. Wexford
Ballinamore Total, Co. Leitrim
Carrickmacross (ED 001 Carrickmacross Urban), Co. Monaghan
Environs of New Ross (pt.)(a) (ED 082 New Ross Rural (pt.)), Co. Wexford
Dunmore Total, Co. Galway
Gort Total, Co. Galway
Ballyclogh (ED 232 Kilmaclenine (pt.)), Co. Cork
Killumney (ED 100 Ovens (pt.)), Co. Cork
Athlone Town (ED 014 Moydrum (pt.)), Co. Westmeath
Ashford Total, Co. Wicklow

    """
    #town
    ed_line = re.compile("[a-b]*") 
    counter = 0
    file_name = "eds.txt"
    with codecs.open(file_name, "w", "utf-8")as out_file:
        for line in town_by_ed:
            out_file.write(line + "\n")
            
#joins = read_file("joins.json")
#towns_by_ed  = joins["Electoral Division"][0]
#parse_cso_ed(towns_by_ed)


def topo_meta(file_name):
    topo = read_file(file_name)
    ed_name_list = []
    ed_name_set = set()
    ed_keys = []
    ed = read_file("cso_json/B0105")
    for key in ed["dataset"]["dimension"]["Towns by Electoral Division"]["category"]['index']:
        ed_keys.append(key)

    for j, value in enumerate(topo["objects"]["geo_area"]["geometries"]):
        print value['properties']['CSOED']
        #ed_name_list.append(value['properties']['CSOED'])
        #ed_name_set.add(value['properties']['CSOED'])
        #for i in value['properties']:
        #    print i, value['properties'][i]
        
    print "set len()", len(ed_name_set)
    print "list len()", len(ed_name_list)
#topo_meta("eds_pretty.json")

#write_json(ed,"one_ed")
