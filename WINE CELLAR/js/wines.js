$(document).ready(function(){
	// zadatak 1
	
	// inicijalizacija parametara za dobavljanje niza vina
	var nameFilter = ""; // ime prema kome se vrsi sortiranje
	var sortCriteria = ""; // kriterijum prema kome se sortira 
	var sortDirection = "asc"; // smer sortiranja (bilo koja vrednost sem desc znaci rastuci smer)
	var page = 1; // stranica tabele koja se trenutno prikazuje
	var pageSize = 3; // maksimalan broj vina u tabeli

	var wineCount = 0; // koliko ima vina koja odgovaraju kriterijumia pretrage (azurira se u funkciji getWines() prilikom dobavljanja vina sa servera)

	// dobavlja niza vina sa servera na osnovu zadatih aprametara
	var getWines = function(){

		var filterParams = {
			"name": nameFilter
		}

		var paramsObj = {
			"filter": filterParams,
			"sort": sortCriteria,
			"sortDirection" : sortDirection,
			"page" : page,
			"pageSize" : pageSize
		}

		$.get("http://localhost:3000/api/wines", paramsObj, function(response, status){
			var wines = response.results;
			wineCount = response.count;
			populateTable(wines);

			// paginacija (zadatak 5): sakriti next link ako server nije vratio ni jedno vino (došli smo do kraja liste)
			var numPages = Math.ceil(wineCount / pageSize);
			if(page == numPages || wineCount == 0){ // ako ima samo jedna stranica sa rezultatima, sakri next link
				$("#next").hide(); 
			}else{
				$("#next").show(); 
			}
			if(page == 1){
				$("#back").hide(); // na pocetnoj smo stranici - uklanjamo back	
			}else{
				$("#back").show();
			}
			// end paginacija (zadatak 5)

		}).error(function(xhr, textStatus, error){ // xhr - XMLHttpRequest objekat
			// ako je došlo do greške (npr. pogrešan URL) postaviće se tekst o grešci u spanu sa id="errMsg"
			$("#errMsgGetWines").text("Error loading table data, reason: " + error + ", status: " + textStatus);
			$("#next").hide(); // zadatak 5 (paginacija):  sakriti next link ako je došlo do greške					
		});
	}
	getWines(); // poziv funkcije da bi se inicijalno popunila tabela sa vinima	

	// popunjava tabelu na osnovu prosledjenog niza vina
	var populateTable = function(wineArray){
		$(".wineRow").remove(); // prvo se brišu svi redovi tabele (videti funkciju addRow - svakom redu je dodeljen class='wineRow')
		for(var i=0; i<wineArray.length; i++){
			addRow(wineArray[i]);
		}
	}

	// dodavanje jednog reda u tabelu na osnovu prosledjenog vina
	var addRow = function(wine){
		var row = "<tr class='wineRow'>";
		row += "<td>";
		row += "<div>" + wine.name + "</div>";
		row += "<div><img src='images/wine_images/" + wine.picture + "' width='100'></div>";
		row += "<div><small>" + wine.description + "</small></div>";
		row += "</td>"
		row += "<td>" + wine.year + "</td>"
		row += "<td>" + wine.grapes + "</td>"
		row += "<td>" + wine.country + "</td>"
		row += "<td>" + wine.region + "</td>"
		row += "</tr>"
		$("#wineData").append(row);
	}
	// end zadatak 1

	// zadatak 2
	$("#searchName").keyup(function(){
		// this - vraća DOM element nad kojim se desio događaj, sa $(this) omogućavamo da se mogu nad tim elementom pozivati jQuery metode
		nameFilter = $(this).val(); // svaki put kada korisnik unese karakter preuzima se tekst i stavlja u nameFilter (parametar koji će se slati serveru prilikom dobavljanja vina)				
		page = 1; // zadatak 5 (da ne bi smo ostali na n-toj stranici a ima ih manje od n koje odgovaraju name filteru )
		getWines(); // dobavi novu listu vina i refresh-uj vrednosti u tabeli		
	});
	// end zadatak 2

	// zadatak 3
	var sort = function(criteria){
		if(sortCriteria === criteria){ // zadatak 4: change the sorting direction
			if(sortDirection === "asc"){
				sortDirection = "desc";
			}else{
				sortDirection = "asc";
			}
		}else{
			sortCriteria = criteria;			
			sortDirection = "asc";
		}
		getWines(); // refresh tabele prema sort kriterijumu
	}


	$(".sortBtn").click(function(){ // sva sort dugmeta imaju class = "sortBtn"
		// this - vraća DOM element nad kojim se desio događaj, sa $(this) omogućavamo da se mogu nad tim elementom pozivati jQuery metode
		// $(this).attr("name") vraća vrednost name atributa elementa nad kojim se desio click događaj. Imena su nameštena tako da odgovaraju sort kriterijumima
		sort($(this).attr("name"));		
	});	
	// end zadatak 3

	// zadatak 5
	$("#next").click(function(){		
		var numPages = Math.ceil(wineCount / pageSize);
		if(page<numPages){
			page = page + 1;			
			getWines(); // refresh tabele
		}
	});

	$("#back").click(function(){		
		if(page>1){
			page = page - 1;			
			getWines(); // refresh tabele
		}
	});
	// end zadatak 5

	// zadatak 6

	// funkcija salje prosledjeno vino na server
	var addWine = function(wine){			
		$.post("http://localhost:3000/api/wines", wine, function(data){
			if(shouldAppend(data)){ // zadatak 7
				addRow(data); // server (ako je zahtev uspešno obavljen) kao povratnu vrednost vraća dodato vino. Ovo vino se append-uje u tabelu
			}
		}).error(function(xhr, textStatus, error){
			$("#errMsgAddWine").text("Error adding a wine, reason: " + error + ", status: " + textStatus);
		});
	}

	$("#addBtn").click(function(){
		var wine = { name: $("input[name='nameInput']").val(), 
					description: $("textarea[name='descriptionInput']").val(),  
					picture: "",
					year: $("input[name='yearInput']").val(), 
					grapes: $("input[name='grapesInput']").val(), 
					country: $("input[name='countryInput']").val(), 
					region: $("input[name='regionInput']").val()
					};
		if(checkInput(wine)){ // zadatak 8
			addWine(wine);	
		}
	});		
	// end zadatak 6

	// zadatak 7
	var shouldAppend = function(wine){		
		var wname = wine.name.toLowerCase();
		var filter = nameFilter.toLowerCase();
		var index = wname.indexOf(filter);

		if(nameFilter === "" || index!=-1){
			var noDisplayed = $(".wineRow").length; // koliko je vina trenutno prikazano
			if(noDisplayed < pageSize){
				$("#next").show();
				wineCount++;
				return true;
			}
		}else{
			return false;
		}
	}
	// end zadatak 7

	// // zadatak 8
	var checkInput = function(wine){
		$(".addWineErrMsg").remove();
		var msg = "<span class=\"addWineErrMsg\" style=\"color: red\">obavezno polje<\span>";
		var msgYear = "<span class=\"addWineErrMsg\" style=\"color: red\">pogrešan unos<\span>";
		var returnVal = true;
		if(!wine.name){
			$("input[name='nameInput']").after(msg);
			returnVal = false;
		}
		if(!wine.description){
			$("textarea[name='descriptionInput']").after(msg);
			returnVal = false;
		}
		if(!wine.year){
			$("input[name='yearInput']").after(msg);
			returnVal = false;
		}else if(isNaN(wine.year)) {
			$("input[name='yearInput']").after(msgYear);
			returnVal = false;
		}
		if(!wine.grapes){
			$("input[name='grapesInput']").after(msg);
			returnVal = false;
		}
		if(!wine.country){
			$("input[name='countryInput']").after(msg);
			returnVal = false;
		}
		if(!wine.region){
			$("input[name='regionInput']").after(msg);
			returnVal = false;
		}
		return returnVal;
	}
	// end zadatak 8

});