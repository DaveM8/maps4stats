"""

parse the meta data out of json-stat files from the cso.ie api


"""

import json
import codecs
import pprint
import numpy as np
import glob
import os

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

def get_numpy(json_obj):
    """
    takes a json-stat file as a json object
    returns the values as an numpy float64
        array non numeric values such as '..'
        which is used by Irish cso to encode missing value
        Is inserted as nan
    """
    data = json_obj['dataset']['value']
    data_float = []
    # try to convert all values to float if that fails
    # put nan insted
    for i, value in enumerate(data):
        try:
            data_float.append(float(value))
        except:
            data_float.append(float('NaN'))
            continue
    # convert to a numpy array
    np_data = np.array(data_float, dtype=np.float64)
    return np_data

def id_key_label_value(json_obj):
    """
    takes a json stat as a python json object
    returns a dict with the id's as key and a list of all labels as an array
            a list of the ids
    This will be used for searched purpuses
    Also I would like to cluster the data by these key words to find patterns in the data
    """
    meta = {}
    keys =json_obj['dataset']['dimension']['id']
    for value in keys:
        temp  = []
        for j in json_obj['dataset']['dimension'][value]['category']['label']:
            temp.append(json_obj['dataset']['dimension'][value]['category']['label'][j])
        meta[value] = temp
    return meta
    
        
#json_obj = read_file("C0318")
# parse_meta(json_obj)
#np_values = get_numpy(json_obj)



def get_all_names(path):
    """
    go throught all json-stat files in a folder and 
    open it save the dataset.lable and the file name to a file
 
    """
    os.chdir(path)
    all_files = []
    for files in glob.glob("*"):
        if files == "all_names" or files == "meta.json":
            # do not read this source file or the file we are writing
            continue
        current = {}
        json_obj = read_file(files)
        file_dict = {}
        if json_obj:
            #try:
            ids = json_obj['dataset']['dimension']['id']
            print ids
            # getting errors when reading this line
            size = json_obj['dataset'['dimension']]['size']
            print size
            role = json_obj['dataset']['dimension']['role']
    
            label = json_obj['dataset']['label']
            source = json_obj['dataset']['source']
            updated = json_obj['dataset']['updated']
            file_dict['role'] = role
            file_dict['size'] = size
            file_dict['label'] = label
            file_dict['source'] = source
            file_dict['updated'] = updated
            file_dict['meta'] = id_key_label_value(json_obj)
            file_dict['ids'] = ids
            current[files] = file_dict
            all_files.append(current)
            #except:
               # print "Error on ", files
              #  print e
        else:
            continue
    return all_files

def write_json(json_dict, file_name):
    with codecs.open(file_name, "w", "utf-8")as out_file:
       out_file.write(json.dumps(json_dict,
                                 ensure_ascii=False,
                                 indent=4, separators=(',',':'),
                                 encoding="utf-8"))

       
#all_meta = get_all_names("/home/dave/cso_meta/cso_json/")
#write_json(all_meta, "meta.json")

def parse_role(my_json):
    # look for roal data first of all I am going
    # to write code to figure out the years by context
    # this can then be tested by checking the role value
    # original json-stat file
    if my_json:
        for key in my_json:
            ids = my_json[key]['ids']
            current = key[my_json]
            for feature in current['meta']:
                for name in ids:
                    label = feature[name];
                    print label
            break
            
    
def name_label(path):
    """
    go throught all json-stat files in a folder and 
    open it save the dataset.lable and the file name to a file
 
    """
    os.chdir(path)
    file_dict ={}
    for files in glob.glob("*"):
        if files == "parse_meta.py" or files == "meta.json":
            # do not read this source file or the file we are writing
            continue
        # load a dataset
        json_obj = read_file(files)
        if json_obj: # if it is availble
           try:
               label = json_obj['dataset']['label']
               #print files, label
               file_dict[files] = label
           except:
               print "error in ", files
               continue
    write_json(file_dict, "datasets")

names = name_label("/home/dave/cso_meta/cso_json")
write_json(names, "all_names")
