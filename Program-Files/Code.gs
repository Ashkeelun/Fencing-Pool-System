function doGet() {
  return HtmlService.createTemplateFromFile('Page').evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


var DebugON = false;


// CALLED BY HTML
function updateResults(resultHTML, url, create, titles){
  if (DebugON) GSlog('Result HTML: \n\n'+resultHTML);
  var tblreg = /(<table)( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?(?: style=\"(.*?)\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?(>)/g;
  var threg = /(<th)( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?(?: style=\"(.*?)\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?(>)/g;
  var tdreg = /(<td)( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?(?: style=\"(.*?)\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?(>)/g;
  //var trreg = /(<tr)( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?(?: style=\"(.*?)\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?( id=\".*?\"| class=\".*?\"| colspan=\".*?\"| rowspan=\".*?\")?(>)/g;
  resultHTML = resultHTML.replace(tblreg,"$1 $2 $3 $4 $5 $7 $8 style=\"width: 95%;margin: auto;border: 1px solid black;border-collapse: collapse;$6\"$9");
  resultHTML = resultHTML.replace(threg,"$1 $2 $3 $4 $5 $7 $8 style=\"border: 1px solid black;border-collapse: collapse;background-color: rgb(146,145,145);text-align: center;$6\"$9");
  resultHTML = resultHTML.replace(tdreg,"$1 $2 $3 $4 $5 $7 $8 style=\"border: 1px solid black;border-collapse: collapse;$6\"$9");
  //resultHTML = "<div style=\"\">"+resultHTML+"</div>";
  updatePage(resultHTML, url, create, titles);
}


// CALLED BY HTML
function updatePage(html, url, create, titles)
{
  //*---------------------------------------------------------------------------------------------------
  // Page Update.
  // ---------------------------------------------------------------------------------------------------
  if (url)
  {
    if (DebugON) GSlog("Updating Results Page to: url = "+url, "Code", "updatePage(html, url)");
    var pageNames = url.split("/");
    var pn = 0;
    var site;
    var siteName;
    if (pageNames[0] == "test" || pageNames[0] == "Test")
    {
      siteName = "musketeerfencingclubtest1";
      site = SitesApp.getSite(siteName).getChildByName("results");
      var pn = 1;
    } else
    {
      siteName = "musketeerfencingclub";
      site = SitesApp.getSite(siteName);
    } 
      if (DebugON) GSlog("Updating "+siteName+"'s page.", "Code", "updatePage(html, url)");
      //var site = SitesApp.getSite("musketeerfencingclub"); 
    if (DebugON) GSlog("Host Site Found: \n      Site Name: "+site.getName()+"\n      Site URL: "+site.getUrl(), "Code", "updatePage(html, url)");
    var urlFound = true;
    var cpn = 0;
    while (pn < pageNames.length)
    {
      if (DebugON) GSlog("Searching for next Page Name: \n      Page #: "+pn+"\n      Page Name: "+pageNames[pn], "Code", "updatePage(html, url)");
      var pages = site.getChildren({ search: pageNames[pn] });
      if (DebugON) GSlog(pages.length+" pages were found with the Page Name: "+pageNames[pn]+"\n      Pages Found: \n"+(pages.length > 0)?getPageNameList(pages):"", "Code", "updatePage(html, url)");
      var brk = false;                                                                                                                                  
      for (var pg in pages)
      {
        if (DebugON) GSlog("Testing Found Page #: "+pg+"\n      Test: if (\""+pages[pg].getName()+"\" == \""+pageNames[pn]+"\")\n      Result: "+(pages[pg].getName() == pageNames[pn]), "Code", "updatePage(html, url)");
        if (pages[pg].getName() == pageNames[pn])
        {
          if (DebugON) GSlog("Found Page # "+pg+" matched the next page name. Getting page.", "Code", "updatePage(html, url)");
          site = site.getChildByName(pageNames[pn]);
          //site = pages[pg];  // Alternate site, page set method pending testing ( Replaces Previous Line: site = site.getChildByName(pageNames[pn]); ).
          brk = true;
          if (DebugON) GSlog("Page # "+pg+", "+pages[pg].getName()+", retrieved, and set.\nCurrent Found Site Info:\n      Name: "+site.getName()+"\n      URL: "+site.getUrl(), "Code", "updatePage(html, url)");
        }
        if (brk) break;
        if (DebugON) GSlog("Match not found. Moving to the next found page, if any.", "Code", "updatePage(html, url)");
      }
      if (site.getName() != pageNames[pn])
      {
        if (DebugON) GSlog("Page Name "+pageNames[pn]+", page # "+pn+", was not found in the site: "+site.getName()+", "+site.getUrl(), "Code", "updatePage(html, url)");
        urlFound = false;
        cpn = pn;
        break;
      }
      pn++;
    }
    if (urlFound)
    {
      if (DebugON) GSlog("URL Found: \n      Queried URL: https://sites.google.com/site/musketeerfencingclub/"+url+"\n      Found Page URL: "+site.getUrl()+"\n      Found Page Name: "+site.getName(), "Code", "updatePage(html, url)");
      //                 (HTML)
      site.setHtmlContent(html);
    } else if (create)
    {
      var template;
      var templates = SitesApp.getSite(siteName).getTemplates();
      for(var i in templates)
      {
        if (templates[i].getName() == "basic-blank-page")
        {
          template = templates[i];
        }
      }
      if (DebugON) GSlog("TEMPLATE: \n"+getPageNameList(templates), "Code", "updatePage(html, url)");
      if (titles)
      {
        if (Array.isArray(titles))
        {
          while (cpn < pageNames.length)
          {
            if (((cpn - (pageNames.length - titles.length)) >= 0) && (titles[(cpn - (pageNames.length - titles.length))]))
            {
              site = site.createPageFromTemplate(titles[(cpn - (pageNames.length - titles.length))], pageNames[cpn], template);
            } else
            {
              site = site.createPageFromTemplate(pageNames[cpn], pageNames[cpn], template);
            }
            cpn++;
          }
        } else
        {
          while (cpn < pageNames.length)
          {
            site = site.createPageFromTemplate(((cpn+1) < pageNames.length)?pageNames[cpn]:titles, pageNames[cpn], template);
            cpn++;
          }
        }
      } else
      {
        while (cpn < pageNames.length)
        {
          site = site.createPageFromTemplate(pageNames[cpn], pageNames[cpn], template);
          cpn++;
        }
      }
      if (DebugON) GSlog("URL Created: \n      Queried URL: https://sites.google.com/site/musketeerfencingclub/"+url+"\n      Created Page URL: "+site.getUrl()+"\n      Created Page Name: "+site.getName(), "Code", "updatePage(html, url)");
      //                 (HTML)
      site.setHtmlContent(html);
    } else
    {
      if (DebugON) GSlog("URL Not Found: \n      Queried URL: https://sites.google.com/site/musketeerfencingclub/"+url+"\n      Found Page URL: "+site.getUrl()+"\n      Found Page Name: "+site.getName(), "Code", "updatePage(html, url)");
    }
  }  //*/
}


// Used to execute/test code on GS server. 
function testScript()
{
  updatePage("<p>TEST B</p>", "test/testing/create/web-page/result-page2", true, ["Test Web Creations", "Test Web Page Creations","Test Result Page Creation 2"]);
}


// Generates a list string of page names from an array of web pages.
function getPageNameList(pglst)
{
  var str = "";
  if (pglst)
  {
    for(var p in pglst)
    {
      if (pglst[p].getName()) str += "      "+p+".  "+pglst[p].getName()+"\n";
      else str += "      "+p+".  (ERROR: No page name was found.)\n";
    }
    return str;
  }
}


// -------------------------------------------------------- NEW ! ------------------------------------------------------- //















// ----------------------------------- POOL SHEET FUNCTIONS ----------------------------------------- //


// Generates the 4 arrays needed to populate the pool sheet.
function getPoolInfo(poolID, ps) // last worked on - 3/8
{
  //GSlog("Started", "Code", "getPoolInfo");
  var poolInfo = getPoolListRow("PoolList", poolID)
  var pool = poolInfo.concat(getPoolListRow("TourneyList", poolInfo[3]), getPoolListRow("ScoringTypeList", poolInfo[7])); // Good - test concat.
  var fencers = getFencerList(poolID); // Create another with order and pool table
  var matches = getMatchList(poolID); // Good
  // Create Score Table
  var msTbl = new Array(fencers.length);
  for (var r = 0; r < fencers.length; r++)
  {
    msTbl[r] = new Array(fencers.length+1);
    msTbl[r][r] = "";
    msTbl[r][msTbl.length] = 0;
  }
  for (var m in matches)
  {
    msTbl[matches[m][1]-1][matches[m][4]-1] = matches[m][3];
    msTbl[matches[m][4]-1][matches[m][1]-1] = matches[m][6];
    if (matches[m][7] >= pool[8] && pool[8] > 0)
    {
      if (matches[m][3] > matches[m][6])
      {
        msTbl[matches[m][1]-1][msTbl.length]--;
      } else if (matches[m][3] < matches[m][6])
      {
        msTbl[matches[m][4]-1][msTbl.length]--;
      }
    }
  }
  //GSlog(msTbl+"\n\n", "Code", "getPoolInfo");
  // Calculate the match score totals
  var scoreTotals = getScoreTotals(pool[7], msTbl, pool[8]);
  //GSlog("ScoreTotals: "+scoreTotals+"\n\n", "Code", "getPoolInfo");
  var scoreTable = new Array(scoreTotals.length);
  for (var s in scoreTotals)
  {
    scoreTable[s] = [fencers[s][2], fencers[s][1], fencers[s][3], fencers[s][4], fencers[s][5]].concat(scoreTotals[s]);
  }
  //GSlog("pool:  "+pool+"\n\nfencers:  "+fencers+"\n\nmatches:  "+matches+"\n\nscoreTable: "+scoreTable+"\n\n", "Code", "getPoolInfo");
  if (ps)
  {
    return [ps, pool, fencers, matches, scoreTable];
  } else
  {
    return ["PM", pool, fencers, matches, scoreTable];
  }
}


//
function setCurMatchNum(poolID, curMatchNum)
{
  //GSlog("Start Set Match");
  var plS = getSS("P").getSheetByName("PoolList");
  var poolList = plS.getRange(2,1,(plS.getDataRange().getLastRow()-1),6).getValues();
  for (var i = 0; i < poolList.length;i++)
  {
    if (poolList[i][0] == poolID)
    {
      plS.getRange(i+2,5,1,1).setValue(curMatchNum);
    }
  }
  //GSlog("End Set Match");
}


// CALLED BY HTML
// Updates a Match Point in the Match List
function updateMatchPoint(poolID, matchNum, side, scoreL, scoreR, dbls)
{
  if (side == "L")
  {
    setMatchField(poolID, matchNum, "LFS", scoreL);
  }
  else if (side == "R")
  {
    setMatchField(poolID, matchNum, "RFS", scoreR);
  }
  else if (side == "D")
  {
    setMatchField(poolID, matchNum, "LFS", scoreL);
    setMatchField(poolID, matchNum, "RFS", scoreR);
    setMatchField(poolID, matchNum, "DBL", dbls);
  }
  return getPoolInfo(poolID);
}





























// ----------------------------------- NEW TOURNAMENT FORM FUNCTIONS ----------------------------------------- //


// Generates the 4 arrays needed to populate the pool sheet.
function setTourneyInfo(tInfo) // last worked on - 4/5
{
  var tourneyID = (getSheet("P", "TourneyList").getRange(getSheet("P", "TourneyList").getDataRange().getLastRow(),1,1,1).getValue()+1);
  insertIntoSheet("P", "TourneyList", [[tourneyID, tInfo[0], tInfo[2], tInfo[1]]]);
}





























// ----------------------------------- NEW POOL FORM FUNCTIONS ----------------------------------------- //


// Generates the 4 arrays needed to populate the pool sheet.
function setPoolInfo(newPool) // last worked on - 4/5
{
  //*
  var d = new Date();
  var poolID = (getSheet("P", "PoolList").getRange(getSheet("P", "PoolList").getDataRange().getLastRow(),1,1,1).getValue()+1);
  var poolInfo = [];
  poolInfo[0] = poolID;
  poolInfo[1] = newPool[0];
  poolInfo[2] = "'"+newPool[1];
  poolInfo[3] = newPool[3];
  poolInfo[4] = 1;
  poolInfo[5] = ("'"+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear());
  poolInfo[6] = newPool[2];
  poolInfo[7] = newPool[4];
  poolInfo[8] = newPool[5];
  insertIntoSheet("P", "PoolList", [poolInfo]);
  addPoolMatchLists(poolID);
  setFencerList(poolID, newPool[7]);
  var matches = [];
  var l = newPool[7].length;
  for (var i = 0; i < initOrder(l).length; i++)
  {
    matches[i] = [(i+1), 
                  initOrder(l)[i][0], 
                  (newPool[7][(initOrder(l)[i][0]-1)][1]), 
                  0, 
                  initOrder(l)[i][1], 
                  (newPool[7][(initOrder(l)[i][1]-1)][1]), 
                  0, 
                  0, 
                  ""];
  }
  GSlog("Set Pool Info - Matches: "+matches+"\n\nPool ID"+poolID+"\n\n", "Code", "setPoolInfo()");
  setMatchList(poolID, matches);
  GSlog("Set Pool Info - Pool ID: "+poolID+"\n\n", "Code", "setPoolInfo()");
  return getPoolInfo(poolID, "OP");
  //*/
}


// 
function loadNewPoolLists()
{
  var tourneyList = getPoolList("TourneyList");
  var scoringList = getPoolList("ScoringTypeList");
  var i = 0;
  while (i < tourneyList.length)
  {
    if (tourneyList[i][2])
    {
      i++;
    } else
    {
      tourneyList.splice(i, 1);
    }
  }
  for (var s in scoringList)
  {
    scoringList.splice(3, 4);
  }
  return [tourneyList, scoringList];
}





























// ----------------------------------- POOL MENU FUNCTIONS ----------------------------------------- //


// Loads Pools for the Pool Menu
function loadPoolMenu()
{
  var poolList = getPoolList("PoolList");
  var tourneyList = getPoolList("TourneyList");
  
  var pools = [];
  for(var p in poolList)
  {
    var tourney;
    for (var t in tourneyList)
    {
      if (tourneyList[t][0] == poolList[p][3])
      {
        tourney = [(tourneyList[t][0] != 0), tourneyList[t][0], tourneyList[t][1]];
        break;
      }
    }
    pools[p] = [poolList[p][0], poolList[p][1], poolList[p][2]].concat(tourney);
  }
  //GSlog('\n\n'+pools);
  return pools;
}





























// ----------------------------------- LOCAL FUNCTIONS ----------------------------------------- //


// INITs the next available Tourney Row and ID
function addNewTourneyInfo(tourneyName)
{
  var tourneyID = (getSheet("P", "TourneyList").getRange(getSheet("P", "TourneyList").getDataRange().getLastRow(),1,1,1).getValue()+1);
  insertIntoSheet("P", "TourneyList", [tourneyID, tourneyName, true]);
  return tourneyID;
}


// INITs the Tourney ID if not found it creates an ID
function getTourneyID(tourneyName)
{
  var tourneySheet = getSheet("P", "TourneyList");
  for (var i = 2; i <= tourneySheet.getDataRange().getLastRow(); i++)
  {
    if (tourneySheet.getRange(i,2,1,1).getValue() == tourneyName)
    {
      return tourneySheet.getRange(i,1,1,1).getValue();
    }
  }
  return addNewTourneyInfo(tourneyName);
}


// 
function getScoreTotals(scoreTypeID, msTbl, dbls) 
{
  // v Add Red Card and possibly Black Card Penalties to Score Calculation.
  //getFencerList(id)
  var sInfo = getPoolListRow("ScoringTypeList", scoreTypeID)
  var adjust = [1, 1, 1, 1];
  for (var x = 0; x < adjust.length; x++)
  {
    switch (sInfo[x+3])
    {
    case "x":
      //GSlog("x");
      adjust[x] = 0;
      break;
    case "i":
      //GSlog("i");
      adjust[x] = 1;
      break;
    case "d":
      //GSlog("d");
      adjust[x] = -1;
      break;
    }
  }
  //GSlog("sInfo = "+sInfo+"\n\nadjust = "+adjust);
  var totals = new Array(msTbl.length);
  var totals2 = new Array(msTbl.length);
  var length = msTbl.length;
  var vic, ts, tr, ind;
  for (var r in msTbl)
  {
    vic = 0;
    ts = 0;
    tr = 0;
    ind = 0;
    for (var c in msTbl)
    {
      if (r != c)
      {
        ts += msTbl[r][c];
        tr += msTbl[c][r];
        if (msTbl[r][c] > msTbl[c][r])
        {
          vic++;
        }
      }
    }
    ind = (ts - tr);
    totals[r] = new Array(6);
    totals[r][0] = (vic+msTbl[r][length])*adjust[0];
    totals[r][1] = ts*adjust[1];
    totals[r][2] = tr*adjust[2];
    totals[r][3] = ind*adjust[3];
    totals[r][4] = r; //row num
    totals2[r] = new Array(4);
    totals2[r][0] = (vic+msTbl[r][length]);
    totals2[r][1] = ts;
    totals2[r][2] = tr;
    totals2[r][3] = ind;
    //GSlog("SCORING CALCULATION:\n\ntotals["+r+"] = "+totals[r]+"\n\ntotals2["+r+"] = "+totals[r]+"\n\nadjust"+adjust);
  }
  //GSlog(totals+"\n\n");
  totals.sort(function(a, b){
    for (var i = 0;i < a.length;i++)
    {
      if (b[i] > a[i])
        return 1;
      else if (b[i] < a[i])
        return -1;
    }
    return 0;
  });
  // INITs first place fencer to 1
  totals[0][5] = 1;
  // Sets Place Value
  for (var i = 1; i < totals.length;i++)
  { //  VICs                                  TS                                    TR                                    IND
    if ((totals[i][0] == totals[(i-1)][0]) && (totals[i][1] == totals[(i-1)][1]) && (totals[i][2] == totals[(i-1)][2]) && (totals[i][3] == totals[(i-1)][3]))
    { // sets current equal to the previous place
      totals[i][5] = totals[(i-1)][5];
    } else
    { // awards next place
      totals[i][5] = (totals[(i-1)][5]+1);
    }
  }
  for (var y in totals)
  {
    totals[y][0] = totals2[totals[y][4]][0];
    totals[y][1] = totals2[totals[y][4]][1];
    totals[y][2] = totals2[totals[y][4]][2];
    totals[y][3] = totals2[totals[y][4]][3];
  }
  //GSlog("")
  var results = new Array(msTbl.length);
  for (var t in totals)
  {
    results[totals[t][4]] = msTbl[totals[t][4]].slice(0, msTbl[totals[t][4]].length-1).concat([totals[t][0], totals[t][1], totals[t][2], totals[t][3], totals[t][5]]);
  } 
  return results;
}


// INITs the Global Array Var, order, for the number of Fencers in the Pool (using the first form).
function initOrder(fn) 
{
  var order;
  switch(fn)
  {
    case 3:
      order = [[1,2],[2,3],[1,3]];
      break;
    case 4:
      order = [[1,4],[2,3],[1,3],[2,4],[3,4],[1,2]];
      break;
    case 5:
      order = [[1,2],[3,4],[5,1],[2,3],[5,4],[1,3],[2,5],[4,1],[3,5],[4,2]];
      break;
    case 6:
      order = [[1,2],[4,5],[2,3],[5,6],[3,1],[6,4],[2,5],[1,4],[5,3],[1,6],[4,2],[3,6],[5,1],[3,4],[6,2]];
      break;
    case 7:
      order = [[1,4],[2,5],[3,6],[7,1],[5,4],[2,3],[6,7],[5,1],[4,3],[6,2],[5,7],[3,1],[4,6],[7,2],[3,5][1,6],[2,4],[7,3],[6,5],[1,2],[4,7]];
      break;
    case 8:
      order = [[2,3],[1,5],[7,4],[6,8],[1,2],[3,4],[5,6],[8,7],[4,1],[5,2],[8,3],[6,7],[4,2],[8,1],[7,5],[3,6],[2,8],[5,4],[6,1],[3,7],[4,8],[2,6],[3,5],[1,7],[4,6],[8,5],[7,2],[1,3]];
      break;
    /* case 9:
      order = [[,],[,],[,],[,],[,]];
      break;
    case 10:
      order = [[,],[,],[,],[,],[,]];
      break;
    case 11:
      order = [[,],[,],[,],[,],[,]];
      break;
    case 12:
      order = [[,],[,],[,],[,],[,]];
      break; */
  }
  return order;
}


// Gets the Global Var boutNum
function getOrder(fn,i,j) 
{
  return initOrder(fn)[i][j];
}





























// ----------------------------------- POOL LIST FUNCTIONS ----------------------------------------- //


// Creates a PoolID's Match Sheets
function setPoolList(list, pools)
{
  var t = getSheet("P", list).getRange(2,1,pools.length,getSheet("P", list).getDataRange().getLastColumn()).setValues(pools);
  var d = t.getValues();
  if (d != pools) GSlog("ERROR! setPoolList failed!\n\nServer Data: "+d+"\n\nNew Data: "+pools);
  // ADD: Create Backup
  // ADD: Log Info
}


// Sets a PoolID's Match's Field's to the specified value
function setPoolListField(id, field, val)
{
  var list = getPoolList("PoolList");
  var p, pt;
  for (p in list)
  {
    if (list[p][0] == id) {pt=1; break;}
  }
  if (pt)
  {
    var listS = getSheet("P", "PoolLost");
    var f;
    switch(field)
    {
    case "TITLE":
      f = 2;
      break;
    case "START":
      f = 3;
      break;
    case "TOURNEY ID":
      f = 4;
      break;
    case "CUR MATCH":
      f = 5;
      break;
    case "LAST OPENED":
      f = 6;
      break;
    case "URL":
      f = 7;
      break;
    case "SCORING ID":
      f = 8;
      break;
    case "DBL":
      f = 9;
      break;
    }
    if (f)
    {
      var t = listS.getRange((p+2),f).setValue(val);
      var d = t.getValue();
      if (d != val) GSlog("ERROR! setPoolListField failed!\n\nServer Data: "+d+"\n\nNew Data: "+val);
      // ADD: Create Backup
      // ADD: Log Update
      // ADD: Log Info
    }
  }
}


// Returns the Pool List's data in an Array
function getPoolListRow(listStr, id)
{
  var list = getPoolList(listStr);
  var r, rt;
  for (r in list)
  {
    if (list[r][0] == id) {rt=1; break;}
  }
  if (rt)
  {
    return list[r];
  } else
  {
    return "Error: ID not found in the list.";
  }
}


// Returns the Pool List's data in an Array
function getPoolList(list)
{
  return getTableArray(getSheet("P", list));
}












// ----------------------------------- MATCH LIST FUNCTIONS ----------------------------------------- //


// Creates a PoolID's Match Sheets
function setMatchList(id, match)
{
  var t = getSheet("M", id+"m").getRange(2,1,match.length,getSheet("M", id+"m").getDataRange().getLastColumn()).setValues(match);
  var d = t.getValues();
  if (d != match) GSlog("ERROR! setMatchList failed!\n\nServer Data: "+d+"\n\nNew Data: "+match);
  // ADD: Create Backup
  // ADD: Log Info
}


// Sets a PoolID's Match's Field's to the specified value
function setMatchField(id, mN, field, val)
{
  var listS = getSheet("M", id+"m");
  if (listS.getDataRange().getLastRow() > mN)
  {
    var f;
    switch(field)
    {
    case "LF#":
      f = 2;
      break;
    case "LFN":
      f = 3;
      break;
    case "LFS":
      f = 4;
      break;
    case "RF#":
      f = 5;
      break;
    case "RFN":
      f = 6;
      break;
    case "RFS":
      f = 7;
      break;
    case "DBL":
      f = 8;
      break;
    case "NOTE":
      f = 9;
      break;
    }
    if (f)
    {
      var t =listS.getRange((mN+1),f).setValue(val);
      var d = t.getValue();
      if (d != val) GSlog("ERROR! setMatchField failed!\n\nServer Data: "+d+"\n\nNew Data: "+val);
      // ADD: Create Backup
      // ADD: Log Update
      // ADD: Log Info
    }
  } 
}


// Returns the Match List's data in an Array
function getMatchList(id)
{
  return getTableArray(getSheet("M", id+"m"));
}


// Returns a Match's data in an Array
function getMatchListRow(id, mN)
{
  var list = getMatchList(id);
  var r, rt;
  for (r in list)
  {
    if (list[r][0] == mN) {rt=1; break;}
  }
  if (rt)
  {
    return list[r];
  } else
  {
    return "Error: Match Number not found in the list.";
  }
}














// ----------------------------------- FENCER LIST FUNCTIONS ----------------------------------------- //


// Creates a PoolID's Match Sheets
function setFencerList(id, fencers)
{
  var t = getSheet("M", id+"f").getRange(2,1,fencers.length,getSheet("M", id+"f").getDataRange().getLastColumn()).setValues(fencers);
  var d = t.getValues();
  if (d != fencers) GSlog("ERROR! setFencerList failed!\n\nServer Data: "+d+"\n\nNew Data: "+fencers);
  // ADD: Create Backup
  // ADD: Log Info
}


// Sets a PoolID's Match's Field's to the specified value
function setFencerField(id, fN, field, val)
{
  var listS = getSheet("M", id+"f");
  if (listS.getDataRange().getLastRow() > fN)
  {
    var f;
    switch(field)
    {
    case "NAME":
      f = 2;
      brea;
    case "CLUB":
      f = 3;
      break;
    case "YEL":
      f = 4;
      break;
    case "RED":
      f = 5;
      break;
    case "BLACK":
      f = 6;
      break;
    }
    if (f)
    {
      var t = listS.getRange((mN+1),f).setValue(val);
      var d = t.getValue();
      if (d != val) GSlog("ERROR! setFencerField failed!\n\nServer Data: "+d+"\n\nNew Data: "+val);
      // ADD: Create Backup
      // ADD: Log Update
      // ADD: Log Info
    }
  } 
}


// Returns the Match List's data in an Array
function getFencerList(id)
{
  return getTableArray(getSheet("M", id+"f"));
}


// Returns Fencer's data in an Array
function getFencerListRow(id, fN)
{
  var list = getFencerList(id);
  var r, rt;
  for (r in list)
  {
    if (list[r][0] == fN) {rt=1; break;}
  }
  if (rt)
  {
    return list[r];
  } else
  {
    return "Error: Match Number not found in the list.";
  }
}



















// ----------------------------------- Other FUNCTIONS ----------------------------------------- //


// Creates a PoolID's Match Sheets
function addPoolMatchLists(id)
{
  var fs = getSheet("M", "TemplateFencers").copyTo(getSS("M")).setName(id+"f");
  var ms = getSheet("M", "TemplateMatches").copyTo(getSS("M")).setName(id+"m");
  return [fs, ms];
  // ADD: Create Backup
  // ADD: Log New Sheet
  // ADD: Log Info
}


// Returns the selected Sheet's Data as an Array
function getTableArray(s)
{
  return s.getRange(2,1,(s.getDataRange().getLastRow()-1),s.getDataRange().getLastColumn()).getValues();
}


// Get Log, Pool or Match List Spreadsheet ID
function getSS(s)
{
  if (s == "P"||s == "Pool")
  {return SpreadsheetApp.openById("1mxndFon399k7KKb-NvBOdZ1fW8QvFBUitvqafvkxxs0");}
  else if (s == "M"||s == "Match")
  {return SpreadsheetApp.openById("1Ol9hgT7RSklOmhrkuAFxz7tYl_1m3hVSOUi8inHark4");}
  else if (s == "L"||s == "GSlog")
  {return SpreadsheetApp.openById("1iC7POjW4s_h2r3W-YPLGBzLXmISyCSQK1Tl4iiv8egQ");}
  else
  {return SpreadsheetApp.openById(s);}
}


// Get Log, Pool or Match List Spreadsheet's specified Sheet ID
function getSheet(ssID, sheetName)
{
  return getSS(ssID).getSheetByName(sheetName);
}


// Inserts data into a new row in a Log, Pool or Match List Spreadsheet's specified Sheet ID
function insertIntoSheet(ssID, sheetName, rowArray)
{
  var s = getSheet(ssID, sheetName);
  var lr = s.getDataRange().getLastRow();
  var lc = s.getDataRange().getLastColumn();
  Logger.log(lr+" "+lc+"    "+rowArray);
  s.getRange((lr+1),1,1,lc).setValues(rowArray);
  // ADD: Create Backup
  // ADD: Log Insert
  // ADD: Log Info
}


// Logs a String in GS.
function GSlog(str, sFile, sFunction)
{
  Logger.log(str);
  if (!sFile) sFile = "";
  if (!sFunction) sFunction = "";
  insertIntoSheet("L", "Error Log", [[Date(), sFile, sFunction, str]]);
}


















// Get Match List Spreadsheet ID
function getPoolSS()
{
  return SpreadsheetApp.openById("1mxndFon399k7KKb-NvBOdZ1fW8QvFBUitvqafvkxxs0");
}


// Get Pool List Spreadsheet ID
function getMatchSS()
{
  return SpreadsheetApp.openById("1Ol9hgT7RSklOmhrkuAFxz7tYl_1m3hVSOUi8inHark4");
}





// ScoringTypeList

// Pool Match Folder ID = 0Bx2MEVOEILwXM0xiS2tDbXV1NjQ

// Pool Match Template ID = 1Ol9hgT7RSklOmhrkuAFxz7tYl_1m3hVSOUi8inHark4   Sheets: TemplateFencers, TemplateMatches, [PoolID]f, [PoolID]m

// Pool List ID = 1mxndFon399k7KKb-NvBOdZ1fW8QvFBUitvqafvkxxs0   Sheets: PoolList, TourneyList, ScoringTypeList
















