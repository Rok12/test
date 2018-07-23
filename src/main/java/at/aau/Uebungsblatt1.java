package at.aau;

import java.util.Scanner;

public class Uebungsblatt1 {

    public static void main(String[] args) {
        System.out.println("Wählen Sie eine Aufgabe aus:");
        Scanner scanner = new Scanner(System.in);
        int input = scanner.nextInt();
        switch (input){
            case 1: aufgabeEins(); break;
            case 2: aufgabeZwei(); break;
            case 3: aufgabeDrei(); break;
            case 4: aufgabeVier(); break;
            case 5: aufgabeFuenf(); break;
            case 6: aufgabeSechs(); break;
            case 7: aufgabeSieben(); break;
            case 8: aufgabeAcht(); break;
            case 9: aufgabeNeun(); break;
            case 10: aufgabeZehn(); break;
            case 11: aufgabeElf(); break;
            case 12: aufgabeZwolf(); break;
            case 13: aufgabeDreizehn(); break;
            case 14: aufgabeVierzehn(); break;
            case 15: aufgabeFuenfzehn(); break;
            case 16: aufgabeSechszehn(); break;
            case 17: aufgabeSiebzehn(); break;
            default:
                System.out.println("Keine gültige Aufgabe!");
        }
    }

    private static void aufgabeEins() {
        System.out.println("Aufgabe Eins ausgewählt.");

        System.out.println("ESOP ist Super.");

    }

    private static void aufgabeZwei() {
        System.out.println("Aufgabe Zwei ausgewählt.");

        int a = 5;
        System.out.println("Nummer ist: " + a);

    }

    private static void aufgabeDrei() {
        System.out.println("Aufgabe Drei ausgewählt.");

        String b = "Das ist";
        String c = "eine Zeichenkette";

        System.out.println(b + " " + c);

    }


    private static void aufgabeVier() {
        System.out.println("Aufgabe Vier ausgewählt.");

        byte b1 = -32;
        float f1 = 6.24f;
        double d1 = 1.968;
        double d2 = 1.00e-3;
        short s1 = 1624;
        short s2 = 1000;
        String s3 = "A";
        char c1 = 'A';
        boolean b2 = false;
        char c2 = '\n';
        String s4 = "\n";
        char c3 = 0xA5;
        char c4 = '\u0065';
        short s5 = -25874;

        System.out.println(b1);
        System.out.println(f1);
        System.out.println(d1);
        System.out.println(d2);
        System.out.println(s1);
        System.out.println(s2);
        System.out.println(s3);
        System.out.println(c1);
        System.out.println(b2);
        System.out.println(c2);
        System.out.println(s4);
        System.out.println(c3);
        System.out.println(c4);
        System.out.println(s5);

    }

    private static void aufgabeFuenf() {
        System.out.println("Aufgabe Fuenf ausgewählt.");

        double x = 2;
        double y = 3;

        double yx = 2 * x;
        double xy = Math.pow( y,2 );

        double z = xy + yx;

        System.out.println("Endwert: " + z);

    }

    private static void aufgabeSechs() {
        System.out.println("Aufgabe Sechs ausgewählt.");

        double x = 2;
        double y = 3;

        double yx = 2 * x;
        double xy = Math.pow( y,2 );

        double z = xy + yx;

        System.out.println("Das Ergebnis von (2*" + x + ") + (" + y + "^2) ist " + z);
    }

    private static void aufgabeSieben() {
        System.out.println("Aufgabe Sieben ausgewählt.");

        Scanner scanner = new Scanner(System.in);
        double x,y;

        x = scanner.nextDouble();
        y = scanner.nextDouble();

        double yx = 2 * x;
        double xy = Math.pow( y,2 );

        double z = xy + yx;

        System.out.println("Endwert: " + z);


    }

    private static void aufgabeAcht() {
        System.out.println("Aufgabe Acht ausgewählt.");

        double pi = Math.PI;

        System.out.println ("Pi: " + pi);

    }

    private static void aufgabeNeun() {
        System.out.println("Aufgabe Neun ausgewählt.");

        Scanner scanner = new Scanner(System.in);

        System.out.println("Kilometer:");
        double k = scanner.nextDouble();
        System.out.println("liter Verbraucht:");
        double t = scanner.nextDouble();

        double kt = k*t/100;

        System.out.println("Verbrauch ist: " + kt + " liter/100km.");

    }

    private static void aufgabeZehn() {
        System.out.println("Aufgabe Zehn ausgewählt.");

        int a = 10;
        double b = 1.1;
        System.out.println(a+b);

        int a1 = 10;
        double b1 = 1.1;
        double c1 = a1+b1;
        System.out.println(c1);

        int a2 = 10;
        double b2 = 1.1;
        int c2 = a2+ (int)b2;
        System.out.println(c2);

        float a3 = 0;
        double b3 = 1.1;
        double c3 = a3+b3;
        System.out.println(c3);

        double a4 = 0.9;
        double b4 = 1.1;
        int c4 = (int)a4+(int)b4;
        System.out.println(c4);

        float a5 = 0;
        double b5 = 1.1;
        double c5 = b5 / (int)a5;
        System.out.println(c5);

        int a6 = 45;
        int b6 = a6;
        int c6 = Integer.MAX_VALUE+1;
        a6 = a6*a6;
        b6 = (((b6*b6)/b6)%b6);
        System.out.println("a6="+a6+" b6="+b6+" c6="+c6);

    }

    private static void aufgabeElf() {
        System.out.println("Aufgabe Elf ausgewählt.");

        int x = 333;

        if( x <= 200 ) {
            System.out.print("0 - 200: Nicht genuegend");
        }else if (x >= 201 && x <= 250) {
            System.out.print("201 - 250: Genuegend");
        }else if (x >= 251 && x <= 300) {
            System.out.print("251 - 300: Befriedigend");
        }else if (x >= 301 && x <= 350) {
            System.out.print("301 - 350: Gut");
        }else if (x >= 351 && x <= 400){
            System.out.print("351 - 400: Sehr gut");
        }else{
            System.out.println("Da ist wohl was schief gegangen.");
        }

    }

    
    private static void aufgabeZwolf() {
        System.out.println("Aufgabe Zwolf ausgewählt.");

        Scanner scanner = new Scanner(System.in);
        int jahr1 = scanner.nextInt();
        int jahr = jahr1;
        if(jahr%4 == 0 && (jahr%100 != 0 || jahr%400 == 0))
        {
            System.out.println(jahr + " ist ein Schaltjahr.");
        }else{
            System.out.println(jahr + " ist nicht ein Schaltjahr.");
        }

    }

    private static void aufgabeDreizehn() {
        System.out.println("Aufgabe Dreizehn ausgewählt.");

        Scanner scanner = new Scanner(System.in);
        int in = scanner.nextInt();
        int anzHundert = 0;
        while (in >=100){
            anzHundert++;
            in = in-100;
        }
        int anzFuenfzig = 0;
        while (in >=50){
            anzFuenfzig++;
            in = in-50;
        }
        int anzZwanzig = 0;
        while (in >=20){
            anzZwanzig++;
            in = in-20;
        }
        int anzZehn = 0;
        while (in >=10){
            anzZehn++;
            in = in-10;
        }
        int anzFuenf = 0;
        while (in >=5){
            anzFuenf++;
            in = in-5;
        }
        System.out.println("100: " + anzHundert);
        System.out.println("50: " + anzFuenfzig);
        System.out.println("20: " + anzZwanzig);
        System.out.println("10: " + anzZehn);
        System.out.println("5: " + anzFuenf);
        System.out.println("Restwert: " + in);
    }

    private static void aufgabeVierzehn() {
        System.out.println("Aufgabe Vierzehn ausgewählt.");

        Scanner scanner = new Scanner(System.in);

        int month = scanner.nextInt();
        String Wochentag;


        switch (month) {
            case 1:  Wochentag = "Montag";break;
            case 2:  Wochentag = "Dienstag";break;
            case 3:  Wochentag = "Mittwoch";break;
            case 4:  Wochentag = "Doenerstag";break;
            case 5:  Wochentag = "Freitag";break;
            case 6:  Wochentag = "Samstag";break;
            case 7:  Wochentag = "Sonntag";break;
            default: Wochentag = "Hier gibts ein Fehler";
        }
        System.out.println(Wochentag);

    }

    private static void aufgabeFuenfzehn() {
        System.out.println("Aufgabe Fuenfzehn ausgewählt.");

        int steuer = 13000;
        double st = 0.1;
        double st1 = 0.22;
        double st2 = 0.32;
        double st3 = 0.42;


        if( steuer <= 5000 ) {
            System.out.print(steuer * st + steuer);
        }else if (steuer >= 5001 && steuer <= 10000) {
            System.out.print(steuer * st1 + steuer);
        }else if (steuer >= 10001 && steuer <= 15000){
            System.out.println(steuer * st2 + steuer);
        }else
            System.out.println(steuer * st3 + steuer);

    }

    private static void aufgabeSechszehn() {
        System.out.println("Aufgabe Sechszehn ausgewählt.");

        Scanner scanner = new Scanner(System.in);

        double a = scanner.nextDouble();
        double b = scanner.nextDouble();


        double a1 = Math.pow(a,2);
        double b1 = Math.pow(b,2);



        double c1 = a1 + b1;
        double c = Math.sqrt(c1);


       if (a==b&&b==c) {
           System.out.println ("Gleichseitig Dreiceck");
           System.out.println("A: " + a);
           System.out.println("B: " + b);
           System.out.println("C: " + c);
        } else if ((a==b||a==c||b==c)) {
           System.out.println ("Gleichschenkelig Dreieck");
           System.out.println("A: " + a);
           System.out.println("B: " + b);
           System.out.println("C: " + c);
        } else if ((a1 + b1) == c1) {
           System.out.println("Rechtwinklig Dreieck");
           System.out.println("A: " + a);
           System.out.println("B: " + b);
           System.out.println("C: " + c);
        } else if (a<=0) {
           System.out.println ("Fehler!");
        } else if (b<=0) {
           System.out.println ("Fehler!");
        } else if (c<=0) {
           System.out.println ("Fehler!");
        } else
           System.out.println("Das funktioniert nicht.");

    }

    private static void aufgabeSiebzehn() {
        System.out.println("Aufgabe Siebzehn ausgewählt.");


        Scanner scanner = new Scanner(System.in);
        System.out.println("Kreis-koordinaten:");
        double cx = scanner.nextDouble();
        double cy = scanner.nextDouble();
        System.out.println("Radius:");
        double r = scanner.nextDouble();

        System.out.println("Punkt:");
        double px = scanner.nextDouble();
        double py = scanner.nextDouble();

        double insert = Math.pow(px-cx,2) / Math.pow(r,2) + Math.pow(py-cy,2) / Math.pow(r,2);

        if (insert < 1){
            System.out.println("Innerhalb");
        }else if (insert == 1){
            System.out.println("auf dem Kreis");
        }else{
            System.out.println("ausserhalb");
        }



















//        int xKoordinate = 4;
//        int xKoordinateMinus = -4;
//        int yKoordinate = 4;
//        int yKoordinateMinus = -4;
//
//
//        double r = 2;
//
//        double c = 2* Math.PI *r;
//
//
//            if (x < xKoordinate && y < yKoordinate && x > xKoordinateMinus && x > yKoordinateMinus){
//                System.out.println("Punkt ist in der Kreis");
//            }
//            else if (x)


    }

}
