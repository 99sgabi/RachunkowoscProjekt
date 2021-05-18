let dataPrzyjeciaSrodkaTrwalego;
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


function metodaDegresywna(wartoscPoczatkowa,stawkaAmortyzacyjna,
    wskaznikAkceleracji,dataPrzyjeciaSrodkaTrwalego,czestoscNaliczaniaWRoku)
{
    let aktualneUmorzenie = 0;
    let wynik = [];
    let aktualnaDataAmortyzacji = obliczStartowyDzienAmortyzacji(dataPrzyjeciaSrodkaTrwalego)
    let degresywan = true;
    while(aktualneUmorzenie < wartoscPoczatkowa)
    {
        let amortyzacjaRoczna =  wartoscPoczatkowa*stawkaAmortyzacyjna*wskaznikAkceleracji;
        amortyzacjaRoczna = degresywna ? amortyzacjaRoczna*wskaznikAkceleracji : amortyzacjaRoczna;

        let amortyzacjaNaliczana = amortyzacjaRoczna/czestoscNaliczaniaWRoku;
        let podstawaNaliczania = degresywna ? wartoscPoczatkowa - aktualneUmorzenie : wartoscPoczatkowa;

        for(let i = aktualnaDataAmortyzacji.getMonth(); i < czestoscNaliczaniaWRoku && aktualneUmorzenie < wartoscPoczatkowa; 
            i = aktualnaDataAmortyzacji.getMonth())
        {
            wynik.push({
                wartoscPoczatkowa: wartoscPoczatkowa,
                data : aktualnaDataAmortyzacji.toDateString(),
                aktualnaWartoscAmortyzacji: aktualneUmorzenie,
                podstawaNaliczaniaAmortyzacji: podstawaNaliczania,
                stawkaAmortyzacyjna: stawkaAmortyzacyjna,
                odpisUmorzeniaWDanymOkresie: amortyzacjaNaliczana,
                wartoscNettoNaKoniecOkresu: wartoscPoczatkowa - aktualneUmorzenie
            })
            aktualnaData = nastepnyOkres(aktualnaDataAmortyzacji, czestoscNaliczaniaWRoku)
            aktualneUmorzenie += amortyzacjaNaliczana;
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
        wynik.push({
            wartoscPoczatkowa: wartoscPoczatkowa,
            data : aktualnaDataAmortyzacji.toDateString(),
            aktualnaWartoscAmortyzacji: aktualneUmorzenie,
            podstawaNaliczaniaAmortyzacji: wartoscPoczatkowa,
            stawkaAmortyzacyjna: stawkaAmortyzacyjna,
            odpisUmorzeniaWDanymOkresie: amortyzacjaNaliczana,
            wartoscNettoNaKoniecOkresu: wartoscPoczatkowa - aktualneUmorzenie
        })
        aktualnaData = nastepnyOkres(aktualnaDataAmortyzacji, czestoscNaliczaniaWRoku)
        aktualneUmorzenie += amortyzacjaNaliczana;
    }

    return wynik;
}

function obliczStartowyDzienAmortyzacji(dataPrzyjeciaSrodkaTrwalego)
{
    let dataPrzyjecia = new Date(Date.parse(dataPrzyjeciaSrodkaTrwalego));
    let startAmortyzacji;
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
    let aktualnaDataDoObliczenia = new Date(Date.parse(aktualnaData));
    let miesiac = aktualnaDataDoObliczenia.getMonth();
    let rok = aktualnaDataDoObliczenia.getFullYear();
    let ileMiesiecy = 12/czestoscNaliczaniaWRoku;
    if(miesiac + ileMiesiecy > 11)
    {
        rok++;
        miesiac = miesiac + ileMiesiecy;
        miesiac %= 11;
        miesiac += 1;
    }
    else
        miesiac += ileMiesiecy + 1;
    return Date.parse(`${rok}-${miesiac}-01`);
}