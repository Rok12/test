package at.aau;

import sun.awt.SunToolkit;

public class aufgabe_eins {

    private static final Object Graphics2D = 0;

    public static void main(String[] args) {

        System.out.println("-------------------------------------------------------------------------------1.");
//---------------------------------------------------------------------------------------1.
        System.out.println("ESOP ist Super");
        System.out.println("-------------------------------------------------------------------------------2.");
//---------------------------------------------------------------------------------------2.
        int a9 = 5;
        System.out.println("Number: " + a9);
        System.out.println("-------------------------------------------------------------------------------3.");
//---------------------------------------------------------------------------------------3.
        String b8 = "Das ist";
        String c8 = "eine Zeichenkette";

        System.out.println(b8 + " " + c8);
        System.out.println("-------------------------------------------------------------------------------4.");
//---------------------------------------------------------------------------------------4.
        byte i1 = -32;
        float f1 = 6.24f;
        double d1 = 1.968;
        double d2 = 1.00e-3;
        short i2 = 1624;
        short s1 = 1000;
        String s2 = "A";
        char c9 = 'A';
        boolean b9 = false;
        char c10 = '\n';
        String s3 = "\n";
        char s4 = 0xA5;
        char c7 = '\u0065';
        short i3 = -25874;

        System.out.println(i1);
        System.out.println(f1);
        System.out.println(d1);
        System.out.println(d2);
        System.out.println(i2);
        System.out.println(s1);
        System.out.println(s2);
        System.out.println(c9);
        System.out.println(b9);
        System.out.println(c10);
        System.out.println(s3);
        System.out.println(s4);
        System.out.println(c7);
        System.out.println(i3);
        System.out.println("-------------------------------------------------------------------------------5.");
//---------------------------------------------------------------------------------------5.
        double x = 2;
        double y = 3;

        double xy = Math.pow( x,2 );
        double yx = 2 * y;

        double z = xy + yx;

        System.out.println(z);
        System.out.println("-------------------------------------------------------------------------------6.");
//---------------------------------------------------------------------------------------6.
        System.out.println("Das Ergebnis von 2*" + x + y + "^2 ist " + z);
        System.out.println("-------------------------------------------------------------------------------7.");

//---------------------------------------------------------------------------------------7.




        System.out.println("-------------------------------------------------------------------------------8.");
//---------------------------------------------------------------------------------------8.
        double pi = Math.PI;

        System.out.println (pi);
        System.out.println("-------------------------------------------------------------------------------9.");
//---------------------------------------------------------------------------------------9.
        double k = 80;
        double t = 7;

        double kt = k*t/100;

        System.out.println(kt);
        System.out.println("-------------------------------------------------------------------------------10.");
//---------------------------------------------------------------------------------------10.

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
        double c5 = (double)b5 / (int)a5;
        System.out.println(c5);

        int a6 = 45;
        int b6 = a6;
        int c6 = Integer.MAX_VALUE+1;
        a6 = a6*a6;
        b6 = ((b6*b6)/b6%b6);
        System.out.println("a6="+a6+" b6="+b6+" c6="+c6);
        System.out.println("-------------------------------------------------------------------------------11.");
//---------------------------------------------------------------------------------------11.
        int x4 = 333;

        if( x4 <= 200 ) {
            System.out.print("0 - 200: Nicht genuegend");
        }else if (x4 >= 201 && x4 <= 250) {
            System.out.print("201 - 250: Genuegend");
        }else if (x4 >= 251 && x4 <= 300) {
            System.out.print("251 - 300: Befriedigend");
        }else if (x4 >= 301 && x4 <= 350) {
            System.out.print("301 - 350: Gut");
        }else if (x4 >= 351 && x4 <= 400){
            System.out.print("351 - 400: Sehr gut");
        }else{
            System.out.println("Da ist wohl was schief gegangen");
        }
        System.out.println("\n-------------------------------------------------------------------------------12.");
//---------------------------------------------------------------------------------------12.
        int jahr = 2018;
        if(jahr%4 == 0 && (jahr%100 != 0 || jahr%400 == 0))
            {
            System.out.println(jahr + " ist ein Schaltjahr");
            }else{
            System.out.println(jahr + " ist nicht ein Schaltjahr");
            }
        System.out.println("-------------------------------------------------------------------------------13.");
//---------------------------------------------------------------------------------------13.

















        System.out.println("-------------------------------------------------------------------------------14.");
//---------------------------------------------------------------------------------------14.

        int month = 3;
        String Wochentag;
        switch (month) {
            case 1:  Wochentag = "Montag";
                break;
            case 2:  Wochentag = "Dienstag";
                break;
            case 3:  Wochentag = "Mittwoch";
                break;
            case 4:  Wochentag = "Doenerstag";
                break;
            case 5:  Wochentag = "Freitag";
                break;
            case 6:  Wochentag = "Samstag";
                break;
            case 7:  Wochentag = "Sonntag";
                break;
            default: Wochentag = "Hier gibts ein Fehler";
        }
        System.out.println(Wochentag);




        System.out.println("-------------------------------------------------------------------------------15.");
//---------------------------------------------------------------------------------------15.
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
        System.out.println("\n-------------------------------------------------------------------------------16.");
//---------------------------------------------------------------------------------------16.
            double a11 = 3.22;
            double b11 = 2.22;
            double c11 = 4;

            double a22 = Math.pow(a11,2);
            double b22 = Math.pow(b11,2);
            double c22 = Math.pow(c11,2);

            boolean z22 = a22 + b22 == c22;


            if (a11==b11&&b11==c11) {
                System.out.println ("Gleichseitig Dreiceck");
            } else if ((a11==b11||a11==c11||b11==c11)) {
                System.out.println ("Gleichschenkelig Dreieck");
            } else if (Math.pow(a11,2) + Math.pow(b11,2) == Math.pow(c11,2)) {
                System.out.println("Rechtwinklig Dreieck");
            } else if (a11<=0) {
                System.out.println ("Fehler!");
            } else if (b11<=0) {
                System.out.println ("Fehler!");
            } else if (c11<=0) {
                System.out.println ("Fehler!");
            } else
                System.out.println("Das funktioniert nicht, aber warum?!");


        System.out.println("-------------------------------------------------------------------------------17.");
//---------------------------------------------------------------------------------------17.




//- - - - - - - - -A-u-f-g-a-b-e- -2-




//                for(int n = 1;n<=10; n++)
//                System.out.println(n);

//
//                int n2 = 2;
//
//                for(int a23 = 1;a23<=(a23+n2); a23++)
//                System.out.println(a23);







    }
}
