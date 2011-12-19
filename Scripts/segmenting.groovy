
//----------------------------------------------------------------------------------
// test values (change for your os and directories)
inputPath='./../GoldStandardFinnishData/RoughData.csv'
outPath='./../GoldStandardFinnishData/SegmentedData.txt'


InputStreamReader sourcefile = new InputStreamReader(new FileInputStream(inputPath),"UTF-8");

numberToStopTheLoopToShowOnlyPartOfIt = 0
def flagStop = 0
def fmorphemes = [:]


while ( flagStop !=1 && (line = sourcefile.readLine() ) != -1){ 
    numberToStopTheLoopToShowOnlyPartOfIt ++                   //(to on    ly run part of the loop)    
    if(numberToStopTheLoopToShowOnlyPartOfIt >5 || line == null){ break; }    //(to only run part of the loop)
           
   if(line ==null){
       line = ""
       println "Flagging stop"
       flagStop = 1        
    }
    

   /* 
   First if is to ensure code is working, second if runs code if code is working.
   */
   if (line.length() > 1){
   
       def fields = line.split(",")
       def ftokens = fields[0].split(" ")   
       ftokens.each{ token -> 
          // println token
       
           def morphemes = token.split("-")
           morphemes.each{ morpheme ->
               fmorphemes[morpheme]="unknown"
           
           }
       }
   
   
   
   
   
   
   
   
   
   
   
    }
}

println fmorphemes