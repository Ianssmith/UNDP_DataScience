BEGIN{FS=OFS=","}
{
	if(FILENAME == "aglandsqkm.csv"){
		printf "%s,%d,%d,%d\n", $1,$56, (getline < "electricity.csv") $57, (getline < "foodimport.csv") $58
	}

}
#FILENAME=="aglandsqkm.csv"{print $1,$56};FILENAME=="electricity.csv"{print $57}
