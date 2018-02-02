import * as React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import Router from 'next/router';
import { WrappedFormUtils } from 'antd/lib/form/Form';

import AppLayout from '../components/AppLayout';
import InitialProps from '../models/InitialProps';
import Api from '../utils/Api';

const FormItem = Form.Item;

export interface LoginProps {
  form: WrappedFormUtils
}

interface LoginState {
  email: string;
  password: string;
  remember: boolean
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      remember: true
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e: React.FormEvent<any>) {
    e.preventDefault();

    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.log(err);
      } else {
        try {
          const data = await Api.login(values);
          Router.push('/dashboard');
        } catch (err) {
          console.log('error', err);
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <AppLayout>
        <div className="form-wrapper">
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [{
                  required: true,
                  message: 'Please enter email'
                }, {
                  type: 'email',
                  message: 'It is not valid email',
                }]
              })(
                <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: 'Please enter password'
                }, {
                  min: 6,
                  message: 'Password must be minimum 6 characters',
                }]
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              <Button htmlType="submit" style={{ width: '100%' }} type="primary" size="large">Submit</Button>
            </FormItem>
            <div style={{ textAlign: 'center' }}>
              <a className="" href="">Forgot password</a>
            </div>
          </Form>
        </div>
        <style jsx>{`
          .form-wrapper {
            max-width: 500px;
            margin: auto;
            margin-top: 100px;
          }
        `}
        </style>
      </AppLayout>
    );
  }
}

export default Form.create()(Login);