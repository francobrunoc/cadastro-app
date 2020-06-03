<template>
    <div>

        <h1 class="mb-4">Clientes</h1>

        <b-container>
            <div v-if="clientes.length == 0">
                <b-container>
                    <b-alert show variant="warning">Ainda não existem clientes cadastrados</b-alert>
                </b-container>
            </div>
            <div v-else class="h5">
                <div class="table-responsive">
                    <table class="table table-striped table-sm">
                        <thead>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Data Nascimento</th>
                        <th></th>
                        </thead>
                        <tbody>
                        <tr v-for="c in clientes" v-bind:key="c.id">
                            <td>{{c.nome}}</td>
                            <td>{{c.cpf}}</td>
                            <td>{{c.dataNascimento}}</td>
                            <td>
                                <b-button-group>
                                    <b-button @click="_edit(c)">
                                        <b-icon-pencil-square/>
                                    </b-button>
                                    <b-button variant="danger" @click="_delete(c)">
                                        <b-icon-trash/>
                                    </b-button>
                                </b-button-group>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </b-container>


        <b-container>
            <b-card class="shadow-sm">
                <b-button @click="_reset" v-b-tooltip title="Limpar" class="mb-4">
                    <b-icon-file-text/>
                </b-button>
                <b-card-body>
                    <b-form @submit.prevent="_submit">

                        <b-form-group>
                            <b-form-input name="nome" v-model="$v.cliente.nome.$model" :state="validate('nome')"
                                          placeholder="Nome Completo"></b-form-input>
                            <b-form-invalid-feedback>
                                O campo não pode ser nulo
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group>
                            <b-form-input name="cpf" v-mask="'###.###.###-##'" v-model="$v.cliente.cpf.$model"
                                          :state="validate('cpf')"
                                          placeholder="CPF"></b-form-input>
                            <b-form-invalid-feedback>
                                O campo deve ter 11 números
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group>
                            <b-form-input name="dataNascimento" v-mask="'##/##/####'"
                                          v-model="$v.cliente.dataNascimento.$model" :state="validate('dataNascimento')"
                                          placeholder="Data de Nascimento"></b-form-input>
                            <b-form-invalid-feedback>
                                O campo não pode ser nulo e deve ter 8 números
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-button class="mt-3" type="submit" :disabled="$v.cliente.$invalid" v-b-tooltip
                                  title="Guardar">
                            <b-icon-arrow-bar-up/>
                        </b-button>

                    </b-form>
                </b-card-body>
            </b-card>
        </b-container>

    </div>
</template>

<script>
    import axios from 'axios'
    import {mask} from 'vue-the-mask'
    import {required, minLength} from 'vuelidate/lib/validators'

    export default {
        name: "Clientes",
        directives: {mask},
        data() {
            return {
                cliente: {
                    id: null,
                    nome: null,
                    cpf: null,
                    dataNascimento: null
                },
                clientes: [],
                BASE_URL_CLIENTE: 'http://localhost:8081/cliente/'
            }
        },
        methods: {
            _list: function () {
                axios.get(this.BASE_URL_CLIENTE + 'list').then(
                    res => this.clientes = res.data
                ).catch(err => console.log(err));
                this._reset()
            },
            _reset: function () {
                this.cliente = {nome: null, cpf: null, dataNascimento: null}
                this.$v.$reset()
            },
            _submit: function () {
                axios.post(this.BASE_URL_CLIENTE + 'save', this.cliente).then(
                    this._list
                ).catch(err => console.log(err))
            },
            _edit: function (cliente) {
                this.cliente.id = cliente.id
                this.cliente.nome = cliente.nome
                this.cliente.cpf = cliente.cpf
                this.cliente.dataNascimento = cliente.dataNascimento
            },
            _delete: function (cliente) {
                if (confirm('Você tem certeza que deseja excluir este cliente?')) {
                    axios.delete(this.BASE_URL_CLIENTE + cliente.id).then(
                        this._list
                    ).catch(err => console.log(err));
                }
            },
            validate(name) {
                if (name) {
                    const {$dirty, $error} = this.$v.cliente[name];
                    return $dirty ? !$error : null;
                }
            }
        },
        validations: {
            cliente: {
                nome: {required},
                cpf: {required, minLength: minLength(14)},
                dataNascimento: {required, minLength: minLength(10)}
            }
        },
        mounted: function () {
            this._list();
        },
    }
</script>

<style scoped>

</style>
