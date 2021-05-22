let dataPrzyjeciaSrodkaTrwalego;
//aktualna wartosc amortyzacji = dotyczhczasowa wartosc amortyzacji
//12-miesiac, 4-kwartal, 1-rok
let czestoscNaliczaniaWRoku;
let wartoscPoczatkowa;
//w procentach
let stawkaAmortyzacyjna;
let wskaznikAkceleracji;
//false - metoda liniowa, true - metoda degresywna
let metodaDegresywan = false;
let wartoscNetto;
let amortyzacjaRoczna;
let amortyzacjaMiesieczna;

//wyświetlanie
let table = document.getElementsByTagName("table")[0];
let div = document.getElementById("container");

function nowyWiersz(row, lp)
{
    let newRow = table.insertRow(lp);
    let przyciski = newRow.insertCell();
    przyciski.innerHTML = `<button data-row-number="${lp}"  class="down">▼</button>`;
    let data = newRow.insertCell();
    data.innerHTML = row.data.getFullYear() ;
    let wartPocz = newRow.insertCell();
    wartPocz.innerHTML = row.wartoscPoczatkowa;
    let wartUm = newRow.insertCell();
    wartUm.innerHTML = row.wartoscUmorzeniaNaPoczatekOkresu.toFixed(2);
    let podstNalA = newRow.insertCell();
    podstNalA.innerHTML = row.podstawaNaliczaniaAmortyzacji;
    let stawkaA = newRow.insertCell();
    stawkaA.innerHTML = row.stawkaAmortyzacyjna;
    let odpUm = newRow.insertCell();
    odpUm.innerHTML = row.odpisUmorzeniaWDanymOkresie.toFixed(2);
    let netto = newRow.insertCell();
    netto.innerHTML = row.wartoscNettoNaKoniecOkresu.toFixed(2);

}
function nowyWierszSzczegoly(row, lp)
{
    let newRow = table.insertRow(lp);
    let przyciski = newRow.insertCell();
    let data = newRow.insertCell();
    data.innerHTML = row.data.getDate()+"/"+(row.data.getMonth()+1) +"/"+row.data.getFullYear() ;
    let wartPocz = newRow.insertCell();
    wartPocz.innerHTML = row.wartoscPoczatkowa;
    let wartUm = newRow.insertCell();
    wartUm.innerHTML = row.wartoscUmorzeniaNaPoczatekOkresu.toFixed(2);
    let podstNalA = newRow.insertCell();
    podstNalA.innerHTML = row.podstawaNaliczaniaAmortyzacji;
    let stawkaA = newRow.insertCell();
    stawkaA.innerHTML = row.stawkaAmortyzacyjna;
    let odpUm = newRow.insertCell();
    odpUm.innerHTML = row.odpisUmorzeniaWDanymOkresie.toFixed(2);
    let netto = newRow.insertCell();
    netto.innerHTML = row.wartoscNettoNaKoniecOkresu.toFixed(2);

    //newRow.style.display="none";

}
function ukryj(wiersz)
{
    table.rows[wiersz].style.display="none"
    table.rows[wiersz].hidden=true
    console.log(table.rows[wiersz])
}
function pokaz(wiersz)
{
    table.rows[wiersz].style.display="block"
    table.rows[wiersz].hidden=false
    console.log(table.rows[wiersz])
}

div.addEventListener("click", function(event){
    //console.log(event.target)
    if(event.target.className=="down"){
        let rowNumber = parseInt(event.target.dataset.rowNumber)
        pokazSzczegoly(rowNumber);
        console.log(rowNumber)
    }
    return false;
})

function pokazSzczegoly(lp)
{
    //console.log(lp)
    try{
        lp++;
        while(table.rows[lp].cells[1].innerHTML.length!=4 && table.rows.length - 1>lp)
        {
            //if(table.rows[lp].style.display=="none")
            if(table.rows[lp].hidden)
            {
                table.rows[lp].hidden=false
            }
            else {
                table.rows[lp].hidden=true
            }
            lp++;
        }
        //console.log(table.rows[lp].cells[1].innerHTML.length)
        
        //console.log(table.rows[lp])
    }
    catch(e) {
        console.log(e)
    }
}

function czyszczenieTabeli()
{
    for(let i = table.rows.length - 1; i > 0 ; i--)
    {
        table.deleteRow(i);
    }
}

function zliczanieLat(miesiace)
{
    let odpis=0;
    for(let i=0;i<miesiace.length;i++) odpis+=miesiace[i].odpisUmorzeniaWDanymOkresie;

    let wynik = [];
    wynik.push({
        data: miesiace[0].data,
        wartoscPoczatkowa: miesiace[0].wartoscPoczatkowa,
        wartoscUmorzeniaNaPoczatekOkresu: miesiace[0].wartoscUmorzeniaNaPoczatekOkresu,
        podstawaNaliczaniaAmortyzacji: miesiace[0].podstawaNaliczaniaAmortyzacji,
        stawkaAmortyzacyjna: miesiace[0].stawkaAmortyzacyjna,
        odpisUmorzeniaWDanymOkresie: odpis,
        wartoscNettoNaKoniecOkresu: miesiace[miesiace.length-1].wartoscNettoNaKoniecOkresu
    })
    return wynik;
}

function wypelnianieTabeli(wyniki)
{
    try{
        if(wyniki.length>0)
        {
            let rok = wyniki[0].data.getFullYear();
            let lp=1;
            
            let miesiace = [];
            for(let i=0;i<wyniki.length;i++)
            {
                if(wyniki[i].data.getFullYear() == rok)
                {
                    miesiace.push(wyniki[i]);
                }
                else 
                {
                    let wynik = zliczanieLat(miesiace);
                    nowyWiersz(wynik[0],lp);
                    lp++;

                    //szczegolowe wiersze, np. miesiace
                    for(let j=0;j<miesiace.length;j++)
                    {
                        nowyWierszSzczegoly(miesiace[j],lp);
                        lp++;
                    }


                    rok = wyniki[i].data.getFullYear();
                    miesiace.length=0;
                    miesiace.push(wyniki[i]);
                }

            }
            let wynik = zliczanieLat(miesiace);
            nowyWiersz(wynik[0],lp)
            lp++;
            for(let j=0;j<miesiace.length;j++)
            {
                nowyWierszSzczegoly(miesiace[j],lp);
                lp++;
            }
    }}
    catch(error){
        console.log(error)
    }
}

const formularz = document.getElementById("formularz");
formularz.onsubmit = (event) =>
{
    czyszczenieTabeli();
    if(formularz.elements["metoda"].value == "false")
    {
        let wynik = amortyzacjaNaWybranyOkres(
            parseInt(formularz.elements["wartPocz"].value),
            parseFloat(formularz.elements["stwaka"].value),
            parseFloat(formularz.elements["wskaznik"].value),
            formularz.elements["data"].value,
            parseInt(formularz.elements["czestotliwosc"].value),
            false
        );

        wypelnianieTabeli(wynik);

        /*for(let i=0; i<wynik.length;i++)
        {
            nowyWiersz(wynik[i], i);
        }*/
    }
    else
    {
        try{
            let wynik = amortyzacjaNaWybranyOkres(
            parseInt(formularz.elements["wartPocz"].value),
            parseFloat(formularz.elements["stwaka"].value),
            parseFloat(formularz.elements["wskaznik"].value),
            formularz.elements["data"].value,
            parseInt(formularz.elements["czestotliwosc"].value),
            true
            );
            
            wypelnianieTabeli(wynik);
            /*
            for(let i=0; i<wynik.length;i++)
            {
                createNewRow(wynik[i], i);
            }   */           

        }
        catch(error)
        {
            console.log(error)
        }
    }
    
    event.preventDefault();
}

function metodaDegresywnaMiesiace(wartoscPoczatkowa,stawkaAmortyzacyjna,
    wskaznikAkceleracji,dataPrzyjeciaSrodkaTrwalego,czestoscNaliczaniaWRoku)
{
    let aktualneUmorzenie = 0;
    let wynik = [];
    let aktualnaDataAmortyzacji = obliczStartowyDzienAmortyzacji(dataPrzyjeciaSrodkaTrwalego)
    let degresywna = true;
    while(aktualneUmorzenie < wartoscPoczatkowa)
    {
        let amortyzacjaRoczna = 
            degresywna ? (wartoscPoczatkowa - aktualneUmorzenie)*stawkaAmortyzacyjna*wskaznikAkceleracji : wartoscPoczatkowa*stawkaAmortyzacyjna;

        if(amortyzacjaRoczna < wartoscPoczatkowa*stawkaAmortyzacyjna)
        {
            amortyzacjaRoczna = wartoscPoczatkowa*stawkaAmortyzacyjna
            degresywna = false;
        }

        let amortyzacjaNaliczana = amortyzacjaRoczna/czestoscNaliczaniaWRoku;
        amortyzacjaNaliczana = amortyzacjaNaliczana
        let podstawaNaliczania = degresywna ? wartoscPoczatkowa - aktualneUmorzenie : wartoscPoczatkowa;
        console.log( amortyzacjaRoczna)
        for(let i = aktualnaDataAmortyzacji.getMonth(); i < 12 && aktualneUmorzenie < wartoscPoczatkowa; 
            i = aktualnaDataAmortyzacji.getMonth())
        {
            let poprzedniaWartosc = aktualneUmorzenie;
            aktualneUmorzenie += amortyzacjaNaliczana;
            wynik.push({
                wartoscPoczatkowa: wartoscPoczatkowa,
                data : aktualnaDataAmortyzacji,
                wartoscUmorzeniaNaPoczatekOkresu: poprzedniaWartosc,
                podstawaNaliczaniaAmortyzacji: podstawaNaliczania,
                stawkaAmortyzacyjna: degresywna ? stawkaAmortyzacyjna*wskaznikAkceleracji : stawkaAmortyzacyjna,
                odpisUmorzeniaWDanymOkresie: wartoscPoczatkowa - poprzedniaWartosc > amortyzacjaNaliczana ? 
                                                    amortyzacjaNaliczana : wartoscPoczatkowa - poprzedniaWartosc,
                wartoscNettoNaKoniecOkresu: wartoscPoczatkowa - aktualneUmorzenie < 0 ? 0:
                                                    wartoscPoczatkowa - aktualneUmorzenie
            })
            aktualnaDataAmortyzacji = nastepnyOkres(aktualnaDataAmortyzacji, czestoscNaliczaniaWRoku)
            if(i == 11)break;
        }
    }

    return wynik;
}

function metodaLiniowaMiesiace(wartoscPoczatkowa,stawkaAmortyzacyjna,
    dataPrzyjeciaSrodkaTrwalego,czestoscNaliczaniaWRoku)
{
    let amortyzacjaRoczna = wartoscPoczatkowa*stawkaAmortyzacyjna;
    let amortyzacjaNaliczana = amortyzacjaRoczna/czestoscNaliczaniaWRoku;
    let aktualneUmorzenie = 0;
    let wynik = [];
    let aktualnaDataAmortyzacji = obliczStartowyDzienAmortyzacji(dataPrzyjeciaSrodkaTrwalego)

    while(aktualneUmorzenie < wartoscPoczatkowa)
    {
        let poprzedniaWartosc = aktualneUmorzenie;
        aktualneUmorzenie += amortyzacjaNaliczana;
        wynik.push({
            wartoscPoczatkowa: wartoscPoczatkowa,
            data : aktualnaDataAmortyzacji,
            wartoscUmorzeniaNaPoczatekOkresu: poprzedniaWartosc,
            podstawaNaliczaniaAmortyzacji: wartoscPoczatkowa,
            stawkaAmortyzacyjna: stawkaAmortyzacyjna,
            odpisUmorzeniaWDanymOkresie: amortyzacjaNaliczana,
            wartoscNettoNaKoniecOkresu: wartoscPoczatkowa - aktualneUmorzenie
        })
        aktualnaDataAmortyzacji = nastepnyOkres(aktualnaDataAmortyzacji, czestoscNaliczaniaWRoku)
    }
    return wynik;
}

function obliczStartowyDzienAmortyzacji(dataPrzyjeciaSrodkaTrwalego)
{
    let dataPrzyjecia = new Date(Date.parse(dataPrzyjeciaSrodkaTrwalego));
    let miesiac = dataPrzyjecia.getMonth();
    let rok = dataPrzyjecia.getFullYear();
    if(miesiac == 11)
    {
        rok++;
        miesiac = 1;
    }
    else
        miesiac += 2;
    return new Date(Date.parse(`${rok}-${miesiac}-01`));
}

function nastepnyOkres(aktualnaData, czestoscNaliczaniaWRoku)
{
    let miesiac = aktualnaData.getMonth();
    let rok = aktualnaData.getFullYear();
    let ileMiesiecy = 12/czestoscNaliczaniaWRoku;
    if(miesiac + ileMiesiecy > 11)
    {
        rok++;
        miesiac = miesiac + ileMiesiecy;
        miesiac %= 11;
    }
    else
        miesiac += ileMiesiecy + 1;

    return new Date(Date.parse(`${rok}-${miesiac}-01`));
}

function amortyzacjaNaWybranyOkres(wartoscPoczatkowa,stawkaAmortyzacyjna,
    wskaznikAkceleracji,dataPrzyjeciaSrodkaTrwalego,czestoscNaliczaniaWRoku, degresywna)
{
    let miesieczne = degresywna ? metodaDegresywnaMiesiace(
        wartoscPoczatkowa,
        stawkaAmortyzacyjna,
        wskaznikAkceleracji,
        dataPrzyjeciaSrodkaTrwalego,
        12
    ) :
    metodaLiniowaMiesiace(
        wartoscPoczatkowa,
        stawkaAmortyzacyjna,
        dataPrzyjeciaSrodkaTrwalego,
        12
    );
    if(czestoscNaliczaniaWRoku == 12)
        return miesieczne;
    else if(czestoscNaliczaniaWRoku == 4)
    {
        let wynik = [], index = 0;
        let amortyzacjaNaRok = 0;
        while(index < miesieczne.length)
        {
            while(index < miesieczne.length)
            {
                let miesiac = miesieczne[index].data.getMonth()
                amortyzacjaNaRok += miesieczne[index].odpisUmorzeniaWDanymOkresie;
                if([2,5,8,11].includes(miesiac) || index == miesieczne.length - 1)
                {
                    wynik.push({
                        wartoscPoczatkowa: miesieczne[index].wartoscPoczatkowa,
                        data : new Date(Date.parse(`${miesieczne[index].data.getFullYear()}-${kwartal(miesiac) + 1}-01`)),
                        wartoscUmorzeniaNaPoczatekOkresu: miesieczne[index].wartoscPoczatkowa 
                            - miesieczne[index].wartoscNettoNaKoniecOkresu - amortyzacjaNaRok,
                        podstawaNaliczaniaAmortyzacji: miesieczne[index].podstawaNaliczaniaAmortyzacji,
                        stawkaAmortyzacyjna: miesieczne[index].stawkaAmortyzacyjna,
                        odpisUmorzeniaWDanymOkresie: amortyzacjaNaRok,
                        wartoscNettoNaKoniecOkresu: miesieczne[index].wartoscNettoNaKoniecOkresu
                    })
                    amortyzacjaNaRok = 0;
                    index ++;
                    break;
                }
                index++;
            }
        }
        return wynik;
    }
    else if(czestoscNaliczaniaWRoku == 1)
    {
        let wynik = [], index = 0;
        let amortyzacjaNaRok = 0;
        while(index < miesieczne.length)
        {
            while(index < miesieczne.length)
            {
                let miesiac = miesieczne[index].data.getMonth()
                amortyzacjaNaRok += miesieczne[index].odpisUmorzeniaWDanymOkresie;
                if(miesiac == 11 || index == miesieczne.length - 1)
                {
                    console.log(miesieczne[index].data.getFullYear())
                    wynik.push({
                        wartoscPoczatkowa: miesieczne[index].wartoscPoczatkowa,
                        data : new Date(Date.parse(`${miesieczne[index].data.getFullYear()}-12-01`)),
                        wartoscUmorzeniaNaPoczatekOkresu: miesieczne[index].wartoscPoczatkowa 
                            - miesieczne[index].wartoscNettoNaKoniecOkresu - amortyzacjaNaRok,
                        podstawaNaliczaniaAmortyzacji: miesieczne[index].podstawaNaliczaniaAmortyzacji,
                        stawkaAmortyzacyjna: miesieczne[index].stawkaAmortyzacyjna,
                        odpisUmorzeniaWDanymOkresie: amortyzacjaNaRok,
                        wartoscNettoNaKoniecOkresu: miesieczne[index].wartoscNettoNaKoniecOkresu
                    })
                    amortyzacjaNaRok = 0;
                    index ++;
                    break;
                }
                index++;
            }
        }
        return wynik;
    }
    return [];
}

function kwartal(aktualny)
{
    let kwartaly = [2,5,8,11]
    for(let i=0 ; i<4; i++)
    {
        if(aktualny <= kwartaly[i])
            return kwartaly[i];
    }
}

//metodaLiniowa(120000, 0.2, "Mat 9, 2021",12);