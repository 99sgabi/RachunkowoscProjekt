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
    if(formularz.elements["metoda"].value == "false")
    {
        console.log(amortyzacjaNaWybranyOkres(
            parseInt(formularz.elements["wartPocz"].value),
            parseFloat(formularz.elements["stwaka"].value),
            parseFloat(formularz.elements["wskaznik"].value),
            formularz.elements["data"].value,
            parseInt(formularz.elements["czestotliwosc"].value),
            false
        ))
    }
    else
    {
        try{
            console.log(amortyzacjaNaWybranyOkres(
            parseInt(formularz.elements["wartPocz"].value),
            parseFloat(formularz.elements["stwaka"].value),
            parseFloat(formularz.elements["wskaznik"].value),
            formularz.elements["data"].value,
            parseInt(formularz.elements["czestotliwosc"].value),
            true
        ))
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