import java.util.Observable;
import java.util.Observer;

public class Console implements Observer {
    @Override
    public void update(Observable observable, Object obj) {
       String[] action = (String[]) obj;
        if(action[0]=="true"){
            System.out.print(action[1]);
        }else{
            System.out.println("Invalid input!");
        }
    }
}
