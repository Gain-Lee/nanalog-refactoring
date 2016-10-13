package net.gain;

import org.apache.catalina.LifecycleException;
import org.apache.catalina.connector.Connector;
import org.apache.catalina.startup.Tomcat;

import javax.servlet.ServletException;
import java.io.File;

/**
 * Created by Leegain on 2016-10-09.
 */
public class WebServletLancher {
    public static void main(String args[]) throws ServletException, LifecycleException {
        String webappDirLocation = "01/webapp/";

        // 톰캣 서버 실행
        Tomcat tomcat = new Tomcat();
        String webPort = System.getenv("PORT");
        if (webPort == null || webPort.isEmpty()) {
            // 포트 설정
            webPort = "8080";
        }

        tomcat.setPort(Integer.valueOf(webPort).intValue());
        Connector connector = tomcat.getConnector();
        // 인코딩 설정
        connector.setURIEncoding("UTF-8");
        // 접근 패스, 루트디렉토리 설정
        tomcat.addWebapp("/", new File(webappDirLocation).getAbsolutePath());
        System.out.println("configuring app with basedir: " + new File("./" + webappDirLocation).getAbsolutePath());
        tomcat.start();
        tomcat.getServer().await();
    }
}
