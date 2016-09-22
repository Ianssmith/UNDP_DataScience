import scipy as sp
import numpy as np
import pandas as pd

banks = pd.read_csv('combanks.csv')
info = pd.read_csv('countryinfo.csv')

merged = pd.merge(banks, info, on='Country_Name', how='left')

merged.to_csv("data.csv")

