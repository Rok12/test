package at.aau;



import com.sun.tools.javac.util.ArrayUtils;

import java.util.*;

public class Uebungsblatt2 {

    public static void main(String[] args) {
        System.out.println("Wählen Sie eine Aufgabe aus:");
        Scanner scanner = new Scanner(System.in);
        int input = scanner.nextInt();
        switch (input) {
            case 1: aufgabeEins();break;
            case 2: aufgabeZwei();break;
            case 3: aufgabeDrei();break;
            case 4: aufgabeVier();break;
            case 5: aufgabeFuenf();break;
            case 6: aufgabeSechs();break;
            case 7: aufgabeSieben();break;
            case 8: aufgabeAcht();break;
            case 9: aufgabeNeun();break;
            case 10: aufgabeZehn();break;
            case 11: aufgabeElf();break;
            case 12: aufgabeZwolf();break;
            case 13: aufgabeDreizehn();break;
            case 14: aufgabeVierzehn();break;
            case 15: aufgabeFuenfzehn();break;
            case 16: aufgabeSechszehn();break;
            case 17: aufgabeSiebzehn();break;
            default:
                System.out.println("Keine gültige Aufgabe!");
        }
    }

        private static void aufgabeEins() {
            System.out.println("Aufgabe Eins ausgewählt.");

            Scanner scanner = new Scanner(System.in);
            int number = scanner.nextInt();


            for(int n=1;n <= number; n++)
                System.out.println(n);


        }

        private static void aufgabeZwei() {
            System.out.println("Aufgabe Zwei ausgewählt.");

            Scanner sca = new Scanner(System.in);
            int a,n;

            a = sca.nextInt();
            n = sca.nextInt();



            for(int a1=a;a1 <= (a+n); a1++)
                System.out.println(a1);

        }

        private static void aufgabeDrei() {
            System.out.println("Aufgabe Drei ausgewählt.");


            Scanner sca = new Scanner(System.in);
            int in = sca.nextInt();

            int summe = 0;
//            int i = 1;


            for(int h = 0; h<= in; h++)
            while (h%2 == 0) {
                summe = summe + h;
                h++;

            }
            System.out.println("Summe = " + summe);

//            int z = 7;
//
//            for(int h = 0; h< z; h++){
//                while (h % 2 == 0) {
//                    System.out.println(h + 1);
//                    break;
//                }}

        }


        private static void aufgabeVier() {
            System.out.println("Aufgabe Vier ausgewählt.");



            int x = 10;

            do {
                System.out.print("value of x : " + x );
                x++;
            }while( x < 20 );


        }

        private static void aufgabeFuenf() {
            System.out.println("Aufgabe Fuenf ausgewählt.");

            for(int n=-10;n <= 10; n++)
                System.out.println(n);


        }

        private static void aufgabeSechs() {
            System.out.println("Aufgabe Sechs ausgewählt.");

            int Zaehler = 50;
            System.out.println( Zaehler + "\n" );
            Zaehler = Zaehler++;
            System.out.println( Zaehler +"\n ");
        }

        private static void aufgabeSieben() {
            System.out.println("Aufgabe Sieben ausgewählt.");
            Scanner scanner = new Scanner(System.in);
            int number = 0;
            int numOfInputs= 0;
            int maxValue = 0;
            int secMaxValue = 0;


            do {
                number = scanner.nextInt();
                System.out.print("value of x: " + number );
                System.out.print("\n");
                numOfInputs++;
                if (number > maxValue) {
                    secMaxValue = maxValue;
                    maxValue = number;
               }else if (secMaxValue < number){
                    secMaxValue = number;
               }

            }while( number != 0 );

            System.out.println("Max Value: " + maxValue);
            System.out.println("Zweite Max Value: " + secMaxValue);
            System.out.println("Anzahl: " + numOfInputs);

        }

        private static void aufgabeAcht() {
            System.out.println("Aufgabe Acht ausgewählt.");
            
        }

        private static void aufgabeNeun() {
            System.out.println("Aufgabe Neun ausgewählt.");


        }

        private static void aufgabeZehn() {
            System.out.println("Aufgabe Zehn ausgewählt.");
//
//            Scanner scanner = new Scanner(System.in);
//
//            int n= 0;
//            int nArray = scanner.nextInt();
//            int[] nArray = new int[n];
//            for (int i = 0; i<nArray.length; i++){
//                nArray[i] = i+1;
//                System.out.println(nArray[i] + " ");
//
//            }
//
//            int[] nArray = {1, 2, 3};
//            List nArray = Arrays.asList(nArray);
//            Collections.reverse(nArray);
//            int[] nArray2 = nArray.toArray();
//
//
//
//
//            for (int i = 0; i < nArray.length; i++) {
//                System.out.println(nArray[i] + " ");
//            }
//
//            for (int i = nArray2.length-1; i >=0; i--) {
//                System.out.println(nArray[i] + " ");
//            }
            Scanner scan = new Scanner(System.in);
            ArrayList<Integer> list = new ArrayList<Integer>();
            System.out.print("Enter numbers\n");
            System.out.println("(Click , or . to terminate)");

            while(scan.hasNextInt()){
                list.add(scan.nextInt());
            }

            Integer [] numbers = list.toArray(new Integer[0]);
            for (int i = 0; i < numbers.length; i++) {
                System.out.println(numbers[i] + " ");
            }

            for (int i = numbers.length-1; i >=0; i--) {
                System.out.println(numbers[i] + " ");
            }
        }

        private static void aufgabeElf() {
            System.out.println("Aufgabe Elf ausgewählt.");

//            ArrayList arrOne = new ArrayList();
//            ArrayList arrTwo = new ArrayList();
//
//
//            arrOne.add(1);
//            arrOne.add(5);
//            arrOne.add(7);
//            arrTwo.add(2);
//            arrTwo.add(4);
//            arrTwo.add(6);

            int[] arrOne = new int[] { 1, 5, 7 };
            int[] arrTwo = new int[] { 2, 4, 6 };

//            Object[] arrThree = new Object[arrOne.length + arrTwo.length];
//            int index = arrTwo.length;
//
//            for (int i = 0; i < arrTwo.length; i++) {
//                arrThree[i] = arrTwo[i];
//            }
//            for (int i = 0; i < arrOne.length; i++) {
//                arrThree[i + index] = arrOne[i];
//            }
            int[] both = (int[])ArrayUtils.addAll(arrOne, arrTwo);


            System.out.println(both);

        }

        private static void aufgabeZwolf() {
            System.out.println("Aufgabe Zwolf ausgewählt.");


        }

        private static void aufgabeDreizehn() {
            System.out.println("Aufgabe Dreizehn ausgewählt.");


        }

        private static void aufgabeVierzehn() {
            System.out.println("Aufgabe Vierzehn ausgewählt.");


        }

        private static void aufgabeFuenfzehn() {
            System.out.println("Aufgabe Fuenfzehn ausgewählt.");


        }

        private static void aufgabeSechszehn() {
            System.out.println("Aufgabe Sechszehn ausgewählt.");


        }

        private static void aufgabeSiebzehn() {
            System.out.println("Aufgabe Siebzehn ausgewählt.");



        }





    }


