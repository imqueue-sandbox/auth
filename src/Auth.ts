/*!
 * ISC License
 * 
 * Copyright (c) 2018, Imqueue Sandbox
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 */
import {
    IMQService,
    expose,
    profile,
} from '@imqueue/rpc';
import { jwtEncode, jwtDecode, user as u } from '.';
import { clientOptions } from '../config';

export class Auth extends IMQService {

    private user: u.UserClient;

    public async start() {
        this.user = new u.UserClient(clientOptions);
        await this.user.start();
        return super.start();
    }

    /**
     * Logs user in
     *
     * @param {string} email - user email address
     * @param {string} password - user password hash
     * @return {string|null} - issued user auth token or null if auth failed
     */
    @profile()
    @expose()
    public async login(email: string, password: string): Promise<string | null> {
        const user = await this.user.fetch(email);

        if (!(user && user.password === password && user.isActive)) {
            return null;
        }

        delete user.password;

        return jwtEncode(user);
    }

    /**
     * Logs user out
     *
     * @param {string} token
     * @return {boolean}
     */
    @profile()
    @expose()
    public async logout(token: string): Promise<boolean> {
        // TODO: implement
        return true;
    }

    /**
     * Verify if user token is valid, and if so - returns an associated user
     * object
     *
     * @param {string} token
     * @return {object | null}
     */
    @profile()
    @expose()
    public async verify(token: string): Promise<object | null> {
        return jwtDecode(token) as any;
    }

}