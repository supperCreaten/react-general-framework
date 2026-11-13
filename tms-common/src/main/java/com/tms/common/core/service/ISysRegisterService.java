package com.tms.common.core.service;

import com.tms.common.core.domain.model.RegisterBody;

/**
 * Register service abstraction. Implemented in framework.
 *
 * @author tms
 */
public interface ISysRegisterService
{
    String register(RegisterBody registerBody);
}
