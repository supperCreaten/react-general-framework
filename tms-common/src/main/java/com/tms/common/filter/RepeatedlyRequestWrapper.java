package com.tms.common.filter;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import com.tms.common.utils.http.HttpHelper;
import com.tms.common.constant.Constants;

/**
 * 构建可重复读取inputStream的request
 * 
 * @author tms
 */
public class RepeatedlyRequestWrapper extends HttpServletRequestWrapper
{
    private final byte[] body;

    /**
     * RepeatedlyRequestWrapper
     */
    public RepeatedlyRequestWrapper(HttpServletRequest request, ServletResponse response) throws IOException
    {
        super(request);
        request.setCharacterEncoding(Constants.UTF8);
        response.setCharacterEncoding(Constants.UTF8);

        body = HttpHelper.getBodyString(request).getBytes(Constants.UTF8);
    }

    @Override
    /**
     * 获取构建可重复读取inputStream的request * * @author tms
     */
    public BufferedReader getReader() throws IOException
    {
        return new BufferedReader(new InputStreamReader(getInputStream()));
    }

    @Override
    /**
     * 获取构建可重复读取inputStream的request * * @author tms
     */
    public ServletInputStream getInputStream() throws IOException
    {
        final ByteArrayInputStream bais = new ByteArrayInputStream(body);
        return new ServletInputStream()
        {
            @Override
            /**
             * 读取字节
             */
            public int read() throws IOException
            {
                return bais.read();
            }

            @Override
            /**
             * 可读字节数
             */
            public int available() throws IOException
            {
                return body.length;
            }

            @Override
            /**
             * 是否为finished
             */
            public boolean isFinished()
            {
                return false;
            }

            @Override
            /**
             * 是否为ready
             */
            public boolean isReady()
            {
                return false;
            }

            @Override
            /**
             * 设置构建可重复读取inputStream的request * * @author tms
             */
            public void setReadListener(ReadListener readListener)
            {

            }
        };
    }
}
