var chartServices = angular.module('chartServices',['ngResource']);

chartServices.factory('chartsManager',function($http,$q){
    var chartsManager = {
        data: {"headers":[{"name":"dx","column":"Data","type":"java.lang.String","hidden":false,"meta":true},{"name":"ou","column":"Organisation unit","type":"java.lang.String","hidden":false,"meta":true},{"name":"pe","column":"Period","type":"java.lang.String","hidden":false,"meta":true},{"name":"value","column":"Value","type":"java.lang.Double","hidden":false,"meta":false}],"metaData":{"pe":["2014"],"co":[],"ou":["lnOyHhoLzre","Cpd5l15XxwA","yyW17iCz9As","qg5ySBw9X5l","LGTVRhKSn1V","Crkg9BoUo5w","qarQhOt2OEh","DWSo42hunXH","vYT08q7Wo33","EO3Ps3ny0Nr","vU0Qt1A5IDz","RD96nI1JXVV","ZYYX8Q9SGoV","acZHYslyJLt","MAL4cfZoFhJ","VMgrQWSVIYn","bN5q5k5DgLA","Sj50oz9EHvD","IgTAEKMqKRe","YtVMnut7Foe","sWOWPBvwNY2","hAFRrgDK0fy","kZ6RlMnt2bp","A3b5mw8DJYC","vAtZ8a924Lx"],"names":{"2014":"2014","yyW17iCz9As":"Pwani Region","vU0Qt1A5IDz":"Tanga Region","dx":"Data","vYT08q7Wo33":"Mara Region","ZYYX8Q9SGoV":"Ruvuma Region","vAtZ8a924Lx":"Rukwa Region","RD96nI1JXVV":"Kigoma Region","Crkg9BoUo5w":"Kagera Region","Cpd5l15XxwA":"Dodoma Region","MAL4cfZoFhJ":"Geita Region","vVRVLjgU10c":"Deliveries by skilled attendants","TfoI3vTGv1f":"HMIS_Uzazi wa Mpango (FP)","kZ6RlMnt2bp":"Tabora Region","vz8UCwDZAN4":"Newborns","MPiMYXd5UZD":"PNC (7 days) Mother","hAFRrgDK0fy":"Mwanza Region","GkRazo4mW23":"HIV exposed infants utilising ARV prophylaxis","MohcJv6PapD":"% infants exclusively breastfeeding (6 mos)","deit7zvLIcV":"Delivery rate in Facility","acZHYslyJLt":"Dar Es Salaam Region","ou":"Organisation unit","qg5ySBw9X5l":"Manyara Region","TRoamv0YPt3":"ANC 1st Visit Before 12 weeks rate","A3b5mw8DJYC":"Mbeya Region","sWOWPBvwNY2":"Iringa Region","EO3Ps3ny0Nr":"Shinyanga Region","lnOyHhoLzre":"Kilimanjaro Region","pe":"Period","bN5q5k5DgLA":"Mtwara Region","VMgrQWSVIYn":"Lindi Region","Sj50oz9EHvD":"Morogoro Region","VFMeEDnoa4M":"IVD Percentage of suriving children who received Penta 3","DWSo42hunXH":"Katavi Region","QiA9L6tNHFy":"ANC 4th visits Coverage","YtVMnut7Foe":"Arusha Region","IgTAEKMqKRe":"Simiyu Region","qarQhOt2OEh":"Njombe Region","LGTVRhKSn1V":"Singida Region"}},"rows":[["vVRVLjgU10c","lnOyHhoLzre","2014","51.9"],["vVRVLjgU10c","Cpd5l15XxwA","2014","68.3"],["vVRVLjgU10c","yyW17iCz9As","2014","96.8"],["vVRVLjgU10c","qg5ySBw9X5l","2014","46.5"],["vVRVLjgU10c","LGTVRhKSn1V","2014","58.8"],["vVRVLjgU10c","Crkg9BoUo5w","2014","41.3"],["vVRVLjgU10c","qarQhOt2OEh","2014","73.3"],["vVRVLjgU10c","DWSo42hunXH","2014","67.0"],["vVRVLjgU10c","vYT08q7Wo33","2014","52.6"],["vVRVLjgU10c","EO3Ps3ny0Nr","2014","56.7"],["vVRVLjgU10c","vU0Qt1A5IDz","2014","44.9"],["vVRVLjgU10c","RD96nI1JXVV","2014","52.4"],["vVRVLjgU10c","ZYYX8Q9SGoV","2014","72.3"],["vVRVLjgU10c","acZHYslyJLt","2014","57.3"],["vVRVLjgU10c","MAL4cfZoFhJ","2014","49.5"],["vVRVLjgU10c","VMgrQWSVIYn","2014","59.5"],["vVRVLjgU10c","bN5q5k5DgLA","2014","59.7"],["vVRVLjgU10c","Sj50oz9EHvD","2014","58.2"],["vVRVLjgU10c","IgTAEKMqKRe","2014","42.0"],["vVRVLjgU10c","YtVMnut7Foe","2014","52.7"],["vVRVLjgU10c","sWOWPBvwNY2","2014","78.0"],["vVRVLjgU10c","hAFRrgDK0fy","2014","59.8"],["vVRVLjgU10c","kZ6RlMnt2bp","2014","55.7"],["vVRVLjgU10c","A3b5mw8DJYC","2014","63.7"],["vVRVLjgU10c","vAtZ8a924Lx","2014","71.9"],["deit7zvLIcV","lnOyHhoLzre","2014","95.1"],["deit7zvLIcV","Cpd5l15XxwA","2014","86.1"],["deit7zvLIcV","yyW17iCz9As","2014","95.3"],["deit7zvLIcV","qg5ySBw9X5l","2014","78.2"],["deit7zvLIcV","LGTVRhKSn1V","2014","83.7"],["deit7zvLIcV","Crkg9BoUo5w","2014","75.5"],["deit7zvLIcV","qarQhOt2OEh","2014","95.3"],["deit7zvLIcV","DWSo42hunXH","2014","89.9"],["deit7zvLIcV","vYT08q7Wo33","2014","70.5"],["deit7zvLIcV","EO3Ps3ny0Nr","2014","88.3"],["deit7zvLIcV","vU0Qt1A5IDz","2014","83.9"],["deit7zvLIcV","RD96nI1JXVV","2014","79.9"],["deit7zvLIcV","ZYYX8Q9SGoV","2014","91.1"],["deit7zvLIcV","acZHYslyJLt","2014","91.3"],["deit7zvLIcV","MAL4cfZoFhJ","2014","85.6"],["deit7zvLIcV","VMgrQWSVIYn","2014","89.7"],["deit7zvLIcV","bN5q5k5DgLA","2014","87.7"],["deit7zvLIcV","Sj50oz9EHvD","2014","89.3"],["deit7zvLIcV","IgTAEKMqKRe","2014","71.6"],["deit7zvLIcV","YtVMnut7Foe","2014","79.1"],["deit7zvLIcV","sWOWPBvwNY2","2014","95.2"],["deit7zvLIcV","hAFRrgDK0fy","2014","88.1"],["deit7zvLIcV","kZ6RlMnt2bp","2014","86.5"],["deit7zvLIcV","A3b5mw8DJYC","2014","86.7"],["deit7zvLIcV","vAtZ8a924Lx","2014","89.2"],["TRoamv0YPt3","lnOyHhoLzre","2014","10.5"],["TRoamv0YPt3","Cpd5l15XxwA","2014","14.0"],["TRoamv0YPt3","yyW17iCz9As","2014","10.8"],["TRoamv0YPt3","qg5ySBw9X5l","2014","15.1"],["TRoamv0YPt3","LGTVRhKSn1V","2014","12.7"],["TRoamv0YPt3","Crkg9BoUo5w","2014","9.1"],["TRoamv0YPt3","qarQhOt2OEh","2014","18.8"],["TRoamv0YPt3","DWSo42hunXH","2014","19.9"],["TRoamv0YPt3","vYT08q7Wo33","2014","13.1"],["TRoamv0YPt3","EO3Ps3ny0Nr","2014","11.6"],["TRoamv0YPt3","vU0Qt1A5IDz","2014","13.0"],["TRoamv0YPt3","RD96nI1JXVV","2014","9.6"],["TRoamv0YPt3","ZYYX8Q9SGoV","2014","17.8"],["TRoamv0YPt3","acZHYslyJLt","2014","17.3"],["TRoamv0YPt3","MAL4cfZoFhJ","2014","19.3"],["TRoamv0YPt3","VMgrQWSVIYn","2014","11.9"],["TRoamv0YPt3","bN5q5k5DgLA","2014","13.2"],["TRoamv0YPt3","Sj50oz9EHvD","2014","19.8"],["TRoamv0YPt3","IgTAEKMqKRe","2014","14.3"],["TRoamv0YPt3","YtVMnut7Foe","2014","15.2"],["TRoamv0YPt3","sWOWPBvwNY2","2014","19.3"],["TRoamv0YPt3","hAFRrgDK0fy","2014","15.4"],["TRoamv0YPt3","kZ6RlMnt2bp","2014","16.2"],["TRoamv0YPt3","A3b5mw8DJYC","2014","18.7"],["TRoamv0YPt3","vAtZ8a924Lx","2014","23.1"],["QiA9L6tNHFy","lnOyHhoLzre","2014","27.7"],["QiA9L6tNHFy","Cpd5l15XxwA","2014","35.0"],["QiA9L6tNHFy","yyW17iCz9As","2014","49.6"],["QiA9L6tNHFy","qg5ySBw9X5l","2014","31.7"],["QiA9L6tNHFy","LGTVRhKSn1V","2014","31.0"],["QiA9L6tNHFy","Crkg9BoUo5w","2014","23.5"],["QiA9L6tNHFy","qarQhOt2OEh","2014","27.7"],["QiA9L6tNHFy","DWSo42hunXH","2014","44.1"],["QiA9L6tNHFy","vYT08q7Wo33","2014","38.0"],["QiA9L6tNHFy","EO3Ps3ny0Nr","2014","40.8"],["QiA9L6tNHFy","vU0Qt1A5IDz","2014","27.7"],["QiA9L6tNHFy","RD96nI1JXVV","2014","24.2"],["QiA9L6tNHFy","ZYYX8Q9SGoV","2014","30.8"],["QiA9L6tNHFy","acZHYslyJLt","2014","40.2"],["QiA9L6tNHFy","MAL4cfZoFhJ","2014","36.1"],["QiA9L6tNHFy","VMgrQWSVIYn","2014","37.0"],["QiA9L6tNHFy","bN5q5k5DgLA","2014","27.0"],["QiA9L6tNHFy","Sj50oz9EHvD","2014","44.3"],["QiA9L6tNHFy","IgTAEKMqKRe","2014","38.3"],["QiA9L6tNHFy","YtVMnut7Foe","2014","41.1"],["QiA9L6tNHFy","sWOWPBvwNY2","2014","36.4"],["QiA9L6tNHFy","hAFRrgDK0fy","2014","34.6"],["QiA9L6tNHFy","kZ6RlMnt2bp","2014","30.9"],["QiA9L6tNHFy","A3b5mw8DJYC","2014","40.3"],["QiA9L6tNHFy","vAtZ8a924Lx","2014","43.4"],["vVRVLjgU10c","lnOyHhoLzre","2014","51.9"],["vVRVLjgU10c","Cpd5l15XxwA","2014","68.3"],["vVRVLjgU10c","yyW17iCz9As","2014","96.8"],["vVRVLjgU10c","qg5ySBw9X5l","2014","46.5"],["vVRVLjgU10c","LGTVRhKSn1V","2014","58.8"],["vVRVLjgU10c","Crkg9BoUo5w","2014","41.3"],["vVRVLjgU10c","qarQhOt2OEh","2014","73.3"],["vVRVLjgU10c","DWSo42hunXH","2014","67.0"],["vVRVLjgU10c","vYT08q7Wo33","2014","52.6"],["vVRVLjgU10c","EO3Ps3ny0Nr","2014","56.7"],["vVRVLjgU10c","vU0Qt1A5IDz","2014","44.9"],["vVRVLjgU10c","RD96nI1JXVV","2014","52.4"],["vVRVLjgU10c","ZYYX8Q9SGoV","2014","72.3"],["vVRVLjgU10c","acZHYslyJLt","2014","57.3"],["vVRVLjgU10c","MAL4cfZoFhJ","2014","49.5"],["vVRVLjgU10c","VMgrQWSVIYn","2014","59.5"],["vVRVLjgU10c","bN5q5k5DgLA","2014","59.7"],["vVRVLjgU10c","Sj50oz9EHvD","2014","58.2"],["vVRVLjgU10c","IgTAEKMqKRe","2014","42.0"],["vVRVLjgU10c","YtVMnut7Foe","2014","52.7"],["vVRVLjgU10c","sWOWPBvwNY2","2014","78.0"],["vVRVLjgU10c","hAFRrgDK0fy","2014","59.8"],["vVRVLjgU10c","kZ6RlMnt2bp","2014","55.7"],["vVRVLjgU10c","A3b5mw8DJYC","2014","63.7"],["vVRVLjgU10c","vAtZ8a924Lx","2014","71.9"],["deit7zvLIcV","lnOyHhoLzre","2014","95.1"],["deit7zvLIcV","Cpd5l15XxwA","2014","86.1"],["deit7zvLIcV","yyW17iCz9As","2014","95.3"],["deit7zvLIcV","qg5ySBw9X5l","2014","78.2"],["deit7zvLIcV","LGTVRhKSn1V","2014","83.7"],["deit7zvLIcV","Crkg9BoUo5w","2014","75.5"],["deit7zvLIcV","qarQhOt2OEh","2014","95.3"],["deit7zvLIcV","DWSo42hunXH","2014","89.9"],["deit7zvLIcV","vYT08q7Wo33","2014","70.5"],["deit7zvLIcV","EO3Ps3ny0Nr","2014","88.3"],["deit7zvLIcV","vU0Qt1A5IDz","2014","83.9"],["deit7zvLIcV","RD96nI1JXVV","2014","79.9"],["deit7zvLIcV","ZYYX8Q9SGoV","2014","91.1"],["deit7zvLIcV","acZHYslyJLt","2014","91.3"],["deit7zvLIcV","MAL4cfZoFhJ","2014","85.6"],["deit7zvLIcV","VMgrQWSVIYn","2014","89.7"],["deit7zvLIcV","bN5q5k5DgLA","2014","87.7"],["deit7zvLIcV","Sj50oz9EHvD","2014","89.3"],["deit7zvLIcV","IgTAEKMqKRe","2014","71.6"],["deit7zvLIcV","YtVMnut7Foe","2014","79.1"],["deit7zvLIcV","sWOWPBvwNY2","2014","95.2"],["deit7zvLIcV","hAFRrgDK0fy","2014","88.1"],["deit7zvLIcV","kZ6RlMnt2bp","2014","86.5"],["deit7zvLIcV","A3b5mw8DJYC","2014","86.7"],["deit7zvLIcV","vAtZ8a924Lx","2014","89.2"],["MPiMYXd5UZD","lnOyHhoLzre","2014","47.4"],["MPiMYXd5UZD","Cpd5l15XxwA","2014","62.0"],["MPiMYXd5UZD","yyW17iCz9As","2014","124.0"],["MPiMYXd5UZD","qg5ySBw9X5l","2014","37.5"],["MPiMYXd5UZD","LGTVRhKSn1V","2014","76.2"],["MPiMYXd5UZD","Crkg9BoUo5w","2014","43.9"],["MPiMYXd5UZD","qarQhOt2OEh","2014","91.9"],["MPiMYXd5UZD","DWSo42hunXH","2014","64.0"],["MPiMYXd5UZD","vYT08q7Wo33","2014","49.1"],["MPiMYXd5UZD","EO3Ps3ny0Nr","2014","61.3"],["MPiMYXd5UZD","vU0Qt1A5IDz","2014","41.8"],["MPiMYXd5UZD","RD96nI1JXVV","2014","50.6"],["MPiMYXd5UZD","ZYYX8Q9SGoV","2014","73.6"],["MPiMYXd5UZD","acZHYslyJLt","2014","31.1"],["MPiMYXd5UZD","MAL4cfZoFhJ","2014","44.6"],["MPiMYXd5UZD","VMgrQWSVIYn","2014","73.8"],["MPiMYXd5UZD","bN5q5k5DgLA","2014","77.2"],["MPiMYXd5UZD","Sj50oz9EHvD","2014","79.0"],["MPiMYXd5UZD","IgTAEKMqKRe","2014","49.6"],["MPiMYXd5UZD","YtVMnut7Foe","2014","42.3"],["MPiMYXd5UZD","sWOWPBvwNY2","2014","95.9"],["MPiMYXd5UZD","hAFRrgDK0fy","2014","56.1"],["MPiMYXd5UZD","kZ6RlMnt2bp","2014","49.2"],["MPiMYXd5UZD","A3b5mw8DJYC","2014","69.3"],["MPiMYXd5UZD","vAtZ8a924Lx","2014","84.3"],["vz8UCwDZAN4","lnOyHhoLzre","2014","79.4"],["vz8UCwDZAN4","Cpd5l15XxwA","2014","78.1"],["vz8UCwDZAN4","yyW17iCz9As","2014","112.9"],["vz8UCwDZAN4","qg5ySBw9X5l","2014","61.3"],["vz8UCwDZAN4","LGTVRhKSn1V","2014","104.9"],["vz8UCwDZAN4","Crkg9BoUo5w","2014","75.6"],["vz8UCwDZAN4","qarQhOt2OEh","2014","105.0"],["vz8UCwDZAN4","DWSo42hunXH","2014","76.9"],["vz8UCwDZAN4","vYT08q7Wo33","2014","72.1"],["vz8UCwDZAN4","EO3Ps3ny0Nr","2014","76.5"],["vz8UCwDZAN4","vU0Qt1A5IDz","2014","69.1"],["vz8UCwDZAN4","RD96nI1JXVV","2014","72.8"],["vz8UCwDZAN4","ZYYX8Q9SGoV","2014","82.5"],["vz8UCwDZAN4","acZHYslyJLt","2014","43.8"],["vz8UCwDZAN4","MAL4cfZoFhJ","2014","71.6"],["vz8UCwDZAN4","VMgrQWSVIYn","2014","103.2"],["vz8UCwDZAN4","bN5q5k5DgLA","2014","112.3"],["vz8UCwDZAN4","Sj50oz9EHvD","2014","103.7"],["vz8UCwDZAN4","IgTAEKMqKRe","2014","75.7"],["vz8UCwDZAN4","YtVMnut7Foe","2014","61.6"],["vz8UCwDZAN4","sWOWPBvwNY2","2014","110.4"],["vz8UCwDZAN4","hAFRrgDK0fy","2014","71.1"],["vz8UCwDZAN4","kZ6RlMnt2bp","2014","70.5"],["vz8UCwDZAN4","A3b5mw8DJYC","2014","89.4"],["vz8UCwDZAN4","vAtZ8a924Lx","2014","92.9"],["VFMeEDnoa4M","lnOyHhoLzre","2014","73.5"],["VFMeEDnoa4M","Cpd5l15XxwA","2014","88.7"],["VFMeEDnoa4M","yyW17iCz9As","2014","111.0"],["VFMeEDnoa4M","qg5ySBw9X5l","2014","80.4"],["VFMeEDnoa4M","LGTVRhKSn1V","2014","83.8"],["VFMeEDnoa4M","Crkg9BoUo5w","2014","74.1"],["VFMeEDnoa4M","qarQhOt2OEh","2014","73.9"],["VFMeEDnoa4M","DWSo42hunXH","2014","96.2"],["VFMeEDnoa4M","vYT08q7Wo33","2014","83.8"],["VFMeEDnoa4M","EO3Ps3ny0Nr","2014","111.1"],["VFMeEDnoa4M","vU0Qt1A5IDz","2014","69.3"],["VFMeEDnoa4M","RD96nI1JXVV","2014","59.4"],["VFMeEDnoa4M","ZYYX8Q9SGoV","2014","72.1"],["VFMeEDnoa4M","acZHYslyJLt","2014","72.4"],["VFMeEDnoa4M","MAL4cfZoFhJ","2014","77.2"],["VFMeEDnoa4M","VMgrQWSVIYn","2014","81.8"],["VFMeEDnoa4M","bN5q5k5DgLA","2014","70.8"],["VFMeEDnoa4M","Sj50oz9EHvD","2014","76.1"],["VFMeEDnoa4M","IgTAEKMqKRe","2014","107.0"],["VFMeEDnoa4M","YtVMnut7Foe","2014","91.4"],["VFMeEDnoa4M","sWOWPBvwNY2","2014","86.6"],["VFMeEDnoa4M","hAFRrgDK0fy","2014","74.3"],["VFMeEDnoa4M","kZ6RlMnt2bp","2014","60.8"],["VFMeEDnoa4M","A3b5mw8DJYC","2014","92.8"],["VFMeEDnoa4M","vAtZ8a924Lx","2014","87.6"],["MohcJv6PapD","lnOyHhoLzre","2014","72.9"],["MohcJv6PapD","Cpd5l15XxwA","2014","50.4"],["MohcJv6PapD","yyW17iCz9As","2014","65.5"],["MohcJv6PapD","qg5ySBw9X5l","2014","50.6"],["MohcJv6PapD","LGTVRhKSn1V","2014","80.1"],["MohcJv6PapD","Crkg9BoUo5w","2014","50.6"],["MohcJv6PapD","qarQhOt2OEh","2014","62.2"],["MohcJv6PapD","DWSo42hunXH","2014","41.9"],["MohcJv6PapD","vYT08q7Wo33","2014","55.7"],["MohcJv6PapD","EO3Ps3ny0Nr","2014","49.4"],["MohcJv6PapD","vU0Qt1A5IDz","2014","41.1"],["MohcJv6PapD","RD96nI1JXVV","2014","51.6"],["MohcJv6PapD","ZYYX8Q9SGoV","2014","42.3"],["MohcJv6PapD","acZHYslyJLt","2014","41.5"],["MohcJv6PapD","MAL4cfZoFhJ","2014","35.6"],["MohcJv6PapD","VMgrQWSVIYn","2014","52.6"],["MohcJv6PapD","bN5q5k5DgLA","2014","58.9"],["MohcJv6PapD","Sj50oz9EHvD","2014","65.1"],["MohcJv6PapD","IgTAEKMqKRe","2014","45.3"],["MohcJv6PapD","YtVMnut7Foe","2014","45.3"],["MohcJv6PapD","sWOWPBvwNY2","2014","46.8"],["MohcJv6PapD","hAFRrgDK0fy","2014","54.0"],["MohcJv6PapD","kZ6RlMnt2bp","2014","42.8"],["MohcJv6PapD","A3b5mw8DJYC","2014","68.1"],["MohcJv6PapD","vAtZ8a924Lx","2014","56.6"],["GkRazo4mW23","lnOyHhoLzre","2014","43.2"],["GkRazo4mW23","Cpd5l15XxwA","2014","20.0"],["GkRazo4mW23","yyW17iCz9As","2014","21.3"],["GkRazo4mW23","qg5ySBw9X5l","2014","36.2"],["GkRazo4mW23","LGTVRhKSn1V","2014","22.5"],["GkRazo4mW23","Crkg9BoUo5w","2014","40.8"],["GkRazo4mW23","qarQhOt2OEh","2014","65.4"],["GkRazo4mW23","DWSo42hunXH","2014","51.1"],["GkRazo4mW23","vYT08q7Wo33","2014","13.0"],["GkRazo4mW23","EO3Ps3ny0Nr","2014","41.8"],["GkRazo4mW23","vU0Qt1A5IDz","2014","24.6"],["GkRazo4mW23","RD96nI1JXVV","2014","8.6"],["GkRazo4mW23","ZYYX8Q9SGoV","2014","39.0"],["GkRazo4mW23","acZHYslyJLt","2014","17.0"],["GkRazo4mW23","MAL4cfZoFhJ","2014","22.9"],["GkRazo4mW23","VMgrQWSVIYn","2014","35.7"],["GkRazo4mW23","bN5q5k5DgLA","2014","36.8"],["GkRazo4mW23","Sj50oz9EHvD","2014","13.8"],["GkRazo4mW23","IgTAEKMqKRe","2014","41.5"],["GkRazo4mW23","YtVMnut7Foe","2014","52.1"],["GkRazo4mW23","sWOWPBvwNY2","2014","47.9"],["GkRazo4mW23","hAFRrgDK0fy","2014","47.4"],["GkRazo4mW23","kZ6RlMnt2bp","2014","31.3"],["GkRazo4mW23","A3b5mw8DJYC","2014","43.2"],["GkRazo4mW23","vAtZ8a924Lx","2014","41.1"],["TfoI3vTGv1f","LGTVRhKSn1V","2014","93.9"],["TfoI3vTGv1f","vYT08q7Wo33","2014","98.1"],["TfoI3vTGv1f","EO3Ps3ny0Nr","2014","89.6"],["TfoI3vTGv1f","IgTAEKMqKRe","2014","88.3"],["TfoI3vTGv1f","DWSo42hunXH","2014","91.7"],["TfoI3vTGv1f","RD96nI1JXVV","2014","87.9"],["TfoI3vTGv1f","qarQhOt2OEh","2014","88.3"],["TfoI3vTGv1f","yyW17iCz9As","2014","94.5"],["TfoI3vTGv1f","lnOyHhoLzre","2014","93.7"],["TfoI3vTGv1f","qg5ySBw9X5l","2014","87.7"],["TfoI3vTGv1f","bN5q5k5DgLA","2014","92.8"],["TfoI3vTGv1f","hAFRrgDK0fy","2014","85.7"],["TfoI3vTGv1f","Cpd5l15XxwA","2014","88.9"],["TfoI3vTGv1f","sWOWPBvwNY2","2014","93.5"],["TfoI3vTGv1f","Sj50oz9EHvD","2014","94.7"],["TfoI3vTGv1f","VMgrQWSVIYn","2014","91.9"],["TfoI3vTGv1f","ZYYX8Q9SGoV","2014","93.0"],["TfoI3vTGv1f","acZHYslyJLt","2014","79.6"],["TfoI3vTGv1f","vAtZ8a924Lx","2014","95.3"],["TfoI3vTGv1f","YtVMnut7Foe","2014","90.7"],["TfoI3vTGv1f","kZ6RlMnt2bp","2014","86.2"],["TfoI3vTGv1f","vU0Qt1A5IDz","2014","92.3"],["TfoI3vTGv1f","MAL4cfZoFhJ","2014","87.2"],["TfoI3vTGv1f","Crkg9BoUo5w","2014","87.7"],["TfoI3vTGv1f","A3b5mw8DJYC","2014","90.4"]],"width":4,"height":300},
        defaultChartObject: {
            title: {
                text: ''
            },
            xAxis: {
                categories: [],
                labels:{
                    rotation: -90,
                    style:{ "color": "#000000", "fontWeight": "normal" }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                },labels:{
                    style:{ "color": "#000000", "fontWeight": "bold" }
                }
            },
            labels: {
                items: [{
                    html: '',
                    style: {
                        left: '50px',
                        top: '18px'
                        //color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                }]
            },
            series: []
        },
        //determine the position of metadata using prefix [dx,de,co,pe,ou]
        getTitleIndex: function(analyticsObjectHeaders,name){
            var index = 0;
            var counter = 0;
            angular.forEach(analyticsObjectHeaders,function(header){
               if(header.name == name){
                   index = counter;
               }
                counter++;
            });
            return index;
        },

        //determine the position of data value,(Expected to be the last one)
        getValueIndex: function(analyticsObjectHeaders){
            var counter = -1;
            angular.forEach(analyticsObjectHeaders,function(header){
                counter++;
            });
            return counter;
        },

        //get an array of items from analyticsObject[metadataType == dx,co,ou,pe,value]
        getMetadataArray : function (analyticsObject,metadataType) {
            //determine the position of metadata in rows of values
            var index = this.getTitleIndex(analyticsObject.headers,metadataType);
            var metadataArray = [];
            var checkArr = [];
            if(metadataType == 'dx' || metadataType == 'value'){
                angular.forEach(analyticsObject.rows,function(value){
                    if(checkArr.indexOf(value[index]) == -1){
                        metadataArray.push(value[index]);
                        checkArr.push(value[index]);
                    }
                });
            }else if(metadataType == 'ou'){
                metadataArray = analyticsObject.metaData.ou;
            }else if(metadataType == 'co'){
                metadataArray = analyticsObject.metaData.co;
            }else if(metadataType == 'pe'){
                metadataArray = analyticsObject.metaData.pe;
            }else{
                metadataArray = analyticsObject.metaData.co;
            }

            return metadataArray;
        },

        //preparing categories depending on selections
        //return the meaningfull array of xAxis and yAxis Items
        prepareCategories : function(analyticsObject,xAxis,yAxis){
            var structure = {'xAxisItems':[],'yAxisItems':[]};
            angular.forEach(this.getMetadataArray(analyticsObject,yAxis),function(val){
                structure.yAxisItems.push({'name':analyticsObject.metaData.names[val],'uid':val})
            });
            angular.forEach(this.getMetadataArray(analyticsObject,xAxis),function(val){
                structure.xAxisItems.push({'name':analyticsObject.metaData.names[val],'uid':val})
            });
            return structure;

        },

        //try to find data from the rows of analytics object
        getDataValue : function(analyticsObject,xAxisType,xAxisUid,yAxisType,yAxisUid,filterType,filterUid){
            var num = 0;
            var currentService = this;
            $.each(analyticsObject.rows,function(key,value){
                if(filterType == 'none'){
                    if(value[currentService.getTitleIndex(analyticsObject.headers,yAxisType)] == yAxisUid && value[currentService.getTitleIndex(analyticsObject.headers,xAxisType)] == xAxisUid ){
                        num = parseFloat(value[currentService.getTitleIndex(analyticsObject.headers,'value')]);
                    }
                }else{
                    if(value[currentService.getTitleIndex(analyticsObject.headers,yAxisType)] == yAxisUid && value[currentService.getTitleIndex(analyticsObject.headers,xAxisType)] == xAxisUid && value[currentService.getTitleIndex(analyticsObject.headers,filterType)] == filterUid ){
                        num = parseFloat(value[currentService.getTitleIndex(analyticsObject.headers,'value')]);
                    }
                }

            });
            return num;
        },

        //drawing some charts
        drawChart : function(type){

        },

        //hacks for pie chart
        drawPieChart : function(analyticsObject,xAxisType,yAxisType,filterType,filterUid,title){
            var chartObject = angular.copy(this.defaultChartObject);
            chartObject.title.text = title;
            //chartObject.yAxis.title.text = title.toLowerCase();
            var pieSeries = [];
            var metaDataObject = this.prepareCategories(analyticsObject,xAxisType,yAxisType);
            var currentService = this;
            angular.forEach(metaDataObject.yAxisItems,function(yAxis){
                angular.forEach(metaDataObject.xAxisItems,function(xAxis){
                    console.log(analyticsObject+'--'+xAxisType+'----'+xAxis.uid+'----'+yAxisType+'---'+yAxis.uid+'----'+filterType+'-----'+filterUid)
                    var number = currentService.getDataValue(analyticsObject,xAxisType,xAxis.uid,yAxisType,yAxis.uid,filterType,filterUid);
                    pieSeries.push({name: yAxis.name+" - "+ xAxis.name , y: parseFloat(number)})
                });
            });

            chartObject.series = {type: 'pie', name:title , data: pieSeries,showInLegend: true,
                dataLabels: {
                    enabled: false
                }
            };
            return chartObject;
        },

        //hack for combined charts
        drawCombinedChart : function(analyticsObject,xAxisType,yAxisType,filterType,filterUid,title){
            var chartObject = angular.copy(this.defaultChartObject);
            chartObject.title.text = title;
            //chartObject.yAxis.title.text = title.toLowerCase();
            var pieSeries = [];
            var metaDataObject = this.prepareCategories(analyticsObject,xAxisType,yAxisType);
            var currentService = this;
            angular.forEach(metaDataObject.yAxisItems,function(yAxis){
                var barSeries = [];
                angular.forEach(metaDataObject.xAxisItems,function(xAxis){
                    var number = currentService.getDataValue(analyticsObject,xAxisType,xAxis.uid,yAxisType,yAxis.uid,filterType,filterUid);
                    barSeries.push(parseFloat(number));
                    pieSeries.push({name: yAxis.name+" - "+ xAxis.name , y: parseFloat(number) })
                });
                chartObject.series.push({type: 'column', name: yAxis.name, data: barSeries});
                chartObject.series.push({type: 'spline', name: yAxis.name, data: barSeries});
            });
            chartObject.series.push({type: 'pie', name: title, data: pieSeries,center: [100, 80],size: 150,showInLegend: false,
                dataLabels: {
                    enabled: false
                }
            });

            return chartObject;
        },

        //draw all other types of chart[bar,line,area]
        drawOtherCharts : function(analyticsObject,xAxisType,yAxisType,filterType,filterUid,title,chartType){
            var chartObject = angular.copy(this.defaultChartObject);
            chartObject.title.text = title;
            var metaDataObject = this.prepareCategories(analyticsObject,xAxisType,yAxisType);
            var currentService = this;
            angular.forEach(metaDataObject.yAxisItems,function(yAxis){
                var chartSeries = [];
                angular.forEach(metaDataObject.xAxisItems,function(xAxis){
                    var number = currentService.getDataValue(analyticsObject,xAxisType,xAxis.uid,yAxisType,yAxis.uid,filterType,filterUid);
                    chartSeries.push(parseFloat(number));
                });
                chartObject.series.push({type: chartType, name: yAxis.name, data: chartSeries})
            });
            return chartObject;
        }


    };
    return chartsManager;
});