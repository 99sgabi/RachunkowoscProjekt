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

const formularz = document.getElementById("formularz");
formularz.onsubmit = (event) =>
{
    if(formularz.elements["wartPocz"].value == "false")
    {
        metodaDegresywan = false;
        console.log(metodaLiniowa(
            parseInt(formularz.elements["wartPocz"].value),
            parseFloat(formularz.elements["stwaka"].value),
            formularz.elements["data"].value,
            parseInt(formularz.elements["czestotliwosc"].value)
        ))
    }
    else
    {
        
        metodaDegresywan = true;
        console.log(metodaDegresywna(
            parseInt(formularz.elements["wartPocz"].value),
            parseFloat(formularz.elements["stwaka"].value),
            parseFloat(formularz.elements["wskaznik"].value),
            formularz.elements["data"].value,
            parseInt(formularz.elements["czestotliwosc"].value)
        ))
    }
    
    event.preventDefault();
}

function metodaDegresywna(wartoscPoczatkowa,stawkaAmortyzacyjna,
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
        amortyzacjaNaliczana = Math.round(amortyzacjaNaliczana)
        let podstawaNaliczania = degresywna ? wartoscPoczatkowa - aktualneUmorzenie : wartoscPoczatkowa;
        console.log( amortyzacjaRoczna)
        for(let i = aktualnaDataAmortyzacji.getMonth(); i < 12 && aktualneUmorzenie < wartoscPoczatkowa; 
            i = aktualnaDataAmortyzacji.getMonth())
        {
            let poprzedniaWartosc = aktualneUmorzenie;
            aktualneUmorzenie += amortyzacjaNaliczana;
            wynik.push({
                wartoscPoczatkowa: wartoscPoczatkowa,
                data : aktualnaDataAmortyzacji.toDateString(),
                wartoscUmorzeniaNaPoczatekOkresu: poprzedniaWartosc,
                podstawaNaliczaniaAmortyzacji: podstawaNaliczania,
                stawkaAmortyzacyjna: stawkaAmortyzacyjna,
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

function metodaLiniowa(wartoscPoczatkowa,stawkaAmortyzacyjna,
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
            data : aktualnaDataAmortyzacji.toDateString(),
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


//metodaLiniowa(120000, 0.2, "Mat 9, 2021",12);