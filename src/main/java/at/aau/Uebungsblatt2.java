package at.aau;

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
            case 18: aufgabeAchtzehn();break;
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

            Scanner scanner = new Scanner(System.in);

            int a = scanner.nextInt();
            int n = scanner.nextInt();

            for(int a1=a;a1 <= (a+n); a1++)
                System.out.println(a1);

        }

        private static void aufgabeDrei() {
            System.out.println("Aufgabe Drei ausgewählt.");


            Scanner scanner = new Scanner(System.in);
            int in = scanner.nextInt();

            int summe = 0;

            for(int h = 0; h<= in; h++)
                if (h%2 == 1) {
                summe = summe + h;
                h++;

            }
            System.out.println("Summe der ungeraden Zahlen = " + summe);

        }


        private static void aufgabeVier() {
            System.out.println("Aufgabe Vier ausgewählt.");


            Scanner scanner = new Scanner(System.in);
            System.out.println("Enter numbers");


            double mittelwert = 0;
            double summe = 0;
            int number = 0;
            int sizeArray = 0;
            int i = 0;

            do { number = scanner.nextInt();
                sizeArray++;
                if (i<number){
                    summe = summe + number;
                    number++;
                }
            }while( number != 0 );

            mittelwert = summe / (sizeArray -1);

            System.out.println("Summe: " + summe);
            System.out.println("Mittelwert: " + mittelwert);



        }
        private static void aufgabeFuenf() {
            System.out.println("Aufgabe Fuenf ausgewählt.");

            for(int n=-10;n <= 10; n++)
                System.out.println(n);


        }

        private static void aufgabeSechs() {
            System.out.println("Aufgabe Sechs ausgewählt.");



            Scanner scanner = new Scanner(System.in);
            long zahl = scanner.nextLong();

            long zahl1 = 1;

            for (int  i=1; i<=zahl; i++) {
                zahl1 = zahl1 * i;
            }


            System.out.println ("Die Fakultaet von " + zahl + " ist: " + zahl1);
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


           Scanner scanner = new Scanner(System.in);
           int nummer = scanner.nextInt();


           for (int teiler=1; teiler <= nummer; ++teiler)
                if (nummer%teiler == 0)
                    System.out.println(teiler);

        }

        private static void aufgabeNeun() {
            System.out.println("Aufgabe Neun ausgewählt.");

            Scanner scanner = new Scanner(System.in);
            int fibonacci = scanner.nextInt();


            int[] fib = new int[fibonacci];
            fib[0] = 0;
            fib[1] = 1;

            for (int i = 2; i < fibonacci; i++) {
                fib[i] = fib[i - 1] + fib[i - 2];
            }
            for (int i = 0; i < fibonacci; i++) {
                System.out.print(fib[i] + " ");
            }
        }

        private static void aufgabeZehn() {
            System.out.println("Aufgabe Zehn ausgewählt.");


            Scanner scanner = new Scanner(System.in);
            ArrayList<Integer> list = new ArrayList<Integer>();
            System.out.println("Enter numbers");
            System.out.println("(Click , or . to terminate)");

            while(scanner.hasNextInt()){
                list.add(scanner.nextInt());
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

            int[] arrOne = new int[]{ 1, 5, 7 };
            int[] arrTwo = new int[]{ 0, 2, 4, 6, 10 };
            int arrThree[] = new int[arrOne.length + arrTwo.length];


            int arrOnePointer = 0;
            int arrTwoPointer = 0;

            for (int i = 0; i<arrThree.length; i++){
                if( arrTwoPointer >= arrTwo.length || (arrOnePointer < arrOne.length && (arrOne[arrOnePointer]<arrTwo[arrTwoPointer]))){
                    arrThree[i] = arrOne[arrOnePointer];
                    arrOnePointer++;
                }
                else {
                    arrThree[i] = arrTwo[arrTwoPointer];
                    arrTwoPointer++;
                }
            }

            System.out.println(Arrays.toString(arrThree));
            
        }

        private static void aufgabeZwolf() {
            System.out.println("Aufgabe Zwolf ausgewählt.");

            Scanner scanner = new Scanner(System.in);
            System.out.println("Enter numbers:");
            System.out.println("With 0 terminate:");

            int numbers = 0;
            int i = 0;

            int eins = 0;
            int zwei = 0;
            int drei = 0;
            int vier = 0;
            int fuenf = 0;
            int sechs = 0;
            int sieben = 0;
            int acht = 0;
            int neun = 0;
            int zehn = 0;

            do {numbers = scanner.nextInt();
              if (i < numbers) {

                 switch (numbers) {
                    case 1: eins++;break;
                    case 2: zwei++;break;
                    case 3: drei++;break;
                    case 4: vier++;break;
                    case 5: fuenf++;break;
                    case 6: sechs++;break;
                    case 7: sieben++;break;
                    case 8: acht++;break;
                    case 9: neun++;break;
                    case 10: zehn++;break;
                    default:
                        System.out.println("Keine gültige Aufgabe!");
                }
            }
            }while( numbers != 0 );


            System.out.println("1: " + eins);
            System.out.println("2: " + zwei);
            System.out.println("3: " + drei);
            System.out.println("4: " + vier);
            System.out.println("5: " + fuenf);
            System.out.println("6: " + sechs);
            System.out.println("7: " + sieben);
            System.out.println("8: " + acht);
            System.out.println("9: " + neun);
            System.out.println("10: " + zehn);

        }

        private static void aufgabeDreizehn() {
            System.out.println("Aufgabe Dreizehn ausgewählt.");


            Scanner scanner = new Scanner(System.in);
            ArrayList<Integer> list = new ArrayList<Integer>();
            System.out.println("Enter numbers");
            System.out.println("(Click , or . to terminate)");

            while(scanner.hasNextInt()){
                list.add(scanner.nextInt());
            }

            System.out.println(list);
        }

        private static void aufgabeVierzehn() {
            System.out.println("Aufgabe Vierzehn ausgewählt.");

            int[] arrList = new int[]{2, 6, 9};


            for (int i = 0; i < arrList.length; i++) {
                System.out.println(arrList[i] + " ");
            }

            for (int i1 = arrList.length-1; i1 >=0; i1--) {
                System.out.println(arrList[i1] + " ");
            }
        }

        private static void aufgabeFuenfzehn() {
            System.out.println("Aufgabe Fuenfzehn ausgewählt.");


            boolean[] array1 = {true,true,true};
            boolean[] array2 = {false,false,true};
            int hamming = 0;


            for (int a = 0; a<array1.length; a++) {
                if (array1[a] != array2[a]) {
                    hamming++;
                }
            }
            System.out.println(hamming);
        }

        private static void aufgabeSechszehn() {
            System.out.println("Aufgabe Sechszehn ausgewählt.");

            Scanner scanner = new Scanner( System.in);
            System.out.println("Enter Tagen:");
            int x = scanner.nextInt();
            int y = 24;

            int z = x*y;

            System.out.println(x + " Tage haben " + z + " Stunden.");

        }

        private static void aufgabeSiebzehn() {
            System.out.println("Aufgabe Siebzehn ausgewählt.");

            String original;
            String reverse = "";

            Scanner scanner = new Scanner(System.in);

            System.out.println("Enter your word:");
            original = scanner.nextLine();

            int le = original.length();

            for (int i = le - 1; i >= 0; i--)
                reverse = reverse + original.charAt(i);

            if (original.equals(reverse))
                System.out.println("Palindrome");
            else
                System.out.println("Not Palindrome");

            }

        private static void aufgabeAchtzehn() {
        System.out.println("Aufgabe SiebAchtzehn ausgewählt.");

            Scanner scanner = new Scanner(System.in);
            String caesar = scanner.next();


            String code = "";
            int key = 3;
            for( int i = 0; i < caesar.length(); ++i )
            {
                char curChar = caesar.charAt(i);
                if( curChar >= 'a' && curChar <= 'w')
                    code += (char) ( curChar + key);
                else if ( curChar >='x' && curChar <= 'z')
                    code += (char) ( curChar - 26 + key);
                else
                    code += curChar;
            }
            System.out.println(code);
    }

}
