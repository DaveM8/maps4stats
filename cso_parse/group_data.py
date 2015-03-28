import json
from collections import defaultdict;
import codecs

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
              "Towns by Size", "Region" ];
    
    files = defaultdict(list)
    for i, file_name in enumerate(json_obj):
        for key in file_name:
            for var in file_name[key]['meta']:
                if var in names:
                    files[var].append(key)
        write_json(files, "geo_only.json")
    
def write_json(json_dict, file_name):
    with codecs.open(file_name, "w", "utf-8")as out_file:
       out_file.write(json.dumps(json_dict,
                                 ensure_ascii=False,
                                 sort_keys=True,
                                 indent=4, separators=(',',':'),
                                 encoding="utf-8"))

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
        
meta = read_file("files.json")
simple_cluster(meta)
#geo_only(meta)


#files = read_file("files.json")
#features = []
#for key in files:
#    features.extend(key)

#print len(features)
