import pandas as pd
import os, hashlib
import shutil

class env_copy_anaconda():
    '''
    pythonのパッケージを入れた際のファイルの変化を見える化します
    環境変数に　名前：anaconda3　内容：anaconda3のインストールパスが必要
    '''

    def __init__(self):
        self.anaconda_dir = os.environ['anaconda3']
        self.jupyter_config_dir = os.path.join(os.environ['USERPROFILE'], ".jupyter")
        self.jupyter_data = os.path.join(os.environ['USERPROFILE'], "AppData","Roaming","jupyter")

    def get_list(self):
        working_dir = self.anaconda_dir
        df = self._get_list(working_dir)
        if self.get_hata == 0:
            try:
                os.remove("file_env.csv")
            except:
                pass
            df.to_csv("file_env.csv")
        else:
            print("error")

    def _get_list(self,working_dir):
        file_list = []
        file_list_batsu = []
        for root, dirs, files in os.walk(working_dir):
            for filename in files:
                # print(filename)
                fname = os.path.join(root, filename)
                try:
                    # with open(fname, 'rb') as f:
                    #     checksum = hashlib.md5(f.read()).hexdigest()
                    checksum="nasi"
                    file_list.append([
                        fname, checksum,
                        os.path.getsize(fname) / 1000000, root
                    ])
                except:
                    file_list_batsu.append([fname, "batu"])
        if len(file_list_batsu) == 0:
            self.get_hata = 0
            print("OK")
            df = pd.DataFrame(file_list)
            df.columns=["path","hash","MB","folder"]
        else:
            self.get_hata = 1
            print("NG")
            df = pd.DataFrame(file_list_batsu)
        return df

    def get_diff_list(self):
        a = pd.read_csv("file_env.csv", index_col=0)
        b = pd.read_csv("temp.csv", index_col=0)
        c=a[~a["path"].isin(b["path"])]
        pd.set_option("display.max_colwidth", 150)
        os.remove("file_env_diff.csv")
        c.to_csv("file_env_diff.csv")
        self.diff_df = c

    def create_diff_file(self):
        home_path = os.path.join(os.getcwd(),"diff_env")
        try:
            shutil.rmtree("diff_env")
        except:
            pass
        os.mkdir("diff_env")
        c=pd.read_csv("file_env_diff.csv", index_col=0)
        li=c["path"].values.tolist()
        for f_path_moto in li:
            f_path_copy = f_path_moto.replace(r"C:\Users\mineo\Anaconda38",home_path)
            if not os.path.exists(os.path.dirname(f_path_copy)):
                os.makedirs(os.path.dirname(f_path_copy))
            try:
                shutil.copyfile(f_path_moto,f_path_copy)
            except:
                print(f_path_moto)
            # print (f_path_moto,"OK")
        # if os.path.exists("diff_env"):
        #     shutil.rmtree("diff_env")
        # folder_path = self.anaconda_dir.replace("Anaconda38","diff_env")
        # shutil.move(folder_path,os.getcwd())

    def copy_to_anaconda3(self):
        c=pd.read_csv("file_env_diff.csv", index_col=0)
        li=c["path"].values.tolist()
        folder_path = self.anaconda_dir.replace("Anaconda38","diff_env")
        home_path = os.path.join(os.getcwd(),"diff_env")
        # shutil.copytree("diff_env",folder_path)
        for f_path_moto in li:
            f_path_copy = f_path_moto.replace(r"C:\Users\mineo\Anaconda38",self.anaconda_dir)
            f_path_moto = f_path_moto.replace(r"C:\Users\mineo\Anaconda38",home_path)
            if not os.path.exists(os.path.dirname(f_path_copy)):
                os.makedirs(os.path.dirname(f_path_copy))
            shutil.copyfile(f_path_moto,f_path_copy)



if __name__ == '__main__':
    obj = env_copy_anaconda()
    print(obj.anaconda_dir , obj.jupyter_config_dir , obj.jupyter_data)
    obj.get_list()
    # obj.get_diff_list()
    # obj.create_diff_file()
    # obj.copy_to_anaconda3()