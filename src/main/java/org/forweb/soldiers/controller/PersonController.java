/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.forweb.soldiers.controller;

import org.forweb.soldiers.entity.Person;
import org.forweb.soldiers.service.SpringDelegationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.server.standard.SpringConfigurator;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.EOFException;

@ServerEndpoint(value = "/soldiers", configurator = SpringConfigurator.class)
public class PersonController {


    public static final int PERSON_RADIUS = 15;
    public static final Integer LIFE_AT_START = 10;

    @Autowired
    private SpringDelegationService springDelegationService;


    private int id;
    private Session session;
    
    @OnOpen
    public void onOpen(Session session) {
        this.id = springDelegationService.addAndIncrementPersonId();
        this.session = session;
    }


    @OnMessage
    public void onTextMessage(String message) {
        springDelegationService.onTextMessage(session, message, id);
    }


    @OnClose
    public void onClose() {
        springDelegationService.onClose(id);
    }


    @OnError
    public void onError(Throwable t) throws Throwable {
        // Most likely cause is a user closing their browser. Check to see if
        // the root cause is EOF and if it is ignore it.
        // Protect against infinite loops.
        int count = 0;
        Throwable root = t;
        while (root.getCause() != null && count < 20) {
            root = root.getCause();
            count++;
        }
        if (!(root instanceof EOFException)) {
            throw t;
        }
    }
}