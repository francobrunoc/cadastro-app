<template>
    <div>

        <h1 class="mb-4">Produtos</h1>

        <b-container>
            <div v-if="produtos.length == 0">
                <b-container>
                    <b-alert show variant="warning">Ainda não existem produtos cadastrados</b-alert>
                </b-container>
            </div>
            <div v-else class="h5">
                <div class="table-responsive">
                    <table class="table table-striped table-sm">
                        <thead>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>SKU</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                        <th></th>
                        </thead>
                        <tbody>
                        <tr v-for="p in produtos" v-bind:key="p.id">
                            <td>{{p.nome}}</td>
                            <td>{{p.descricao}}</td>
                            <td>{{p.sku}}</td>
                            <td>{{p.preco}}</td>
                            <td>{{p.quantidade}}</td>
                            <td>
                                <b-button-group>
                                    <b-button @click="_edit(p)">
                                        <b-icon-pencil-square/>
                                    </b-button>
                                    <b-button variant="danger" @click="_delete(p)">
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
                <b-button @click="_reset" v-b-tooltip title="Limpar">
                    <b-icon-file-text/>
                </b-button>
                <b-card-body>
                    <b-form @submit.prevent="_submit">

                        <b-form-group>
                            <b-form-input v-model="$v.produto.nome.$model" :state="validate('nome')"
                                          placeholder="Nome"></b-form-input>
                            <b-form-invalid-feedback>
                                O campo não pode ser nulo
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group>
                            <b-form-input v-model="$v.produto.descricao.$model" :state="validate('descricao')"
                                          placeholder="Descrição"></b-form-input>
                            <b-form-invalid-feedback>
                                O campo não pode ser nulo
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group>
                            <b-form-input v-model="$v.produto.sku.$model" :state="validate('sku')"
                                          placeholder="SKU"></b-form-input>
                            <b-form-invalid-feedback>
                                O campo não pode ser nulo
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group>
                            <b-form-input v-model="$v.produto.preco.$model" :state="validate('preco')"
                                          placeholder="Preço"></b-form-input>
                            <b-form-invalid-feedback>
                                <div v-if="!$v.produto.preco.required">O campo não pode ser nulo</div>
                                <div v-if="!$v.produto.preco.decimal">O campo deve ser numérico decimal ou inteiro</div>
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-form-group>
                            <b-form-input v-model="$v.produto.quantidade.$model" :state="validate('quantidade')"
                                          placeholder="Quantidade"></b-form-input>
                            <b-form-invalid-feedback>
                                <div v-if="!$v.produto.quantidade.required">O campo não pode ser nulo</div>
                                <div v-if="!$v.produto.quantidade.decimal">O campo deve ser numérico e inteiro</div>
                            </b-form-invalid-feedback>
                        </b-form-group>

                        <b-button type="submit" :disabled="$v.produto.$invalid" v-b-tooltip title="Guardar">
                            <b-icon-arrow-bar-up/>
                        </b-button>
                    </b-form>
                </b-card-body>
            </b-card>
        </b-container>

    </div>
</template>

<script>
    import {mask} from "vue-the-mask";
    import axios from "axios";
    import {required, decimal, numeric} from 'vuelidate/lib/validators'

    export default {
        name: "Produtos",
        directives: {mask},
        data() {
            return {
                produto: {
                    id: null,
                    nome: null,
                    descricao: null,
                    sku: null,
                    preco: null,
                    quantidade: null
                },
                produtos: [],
                BASE_URL_PRODUTO: 'http://localhost:8081/produto/'
            }
        },
        methods: {
            _list: function () {
                axios.get( this.BASE_URL_PRODUTO + 'list').then(
                    res => this.produtos = res.data
                ).catch(err => console.log(err));
                this._reset()
            },
            _reset: function () {
                Object.keys(this.produto).forEach(k => this.produto[k] = null);
                this.$v.$reset()
            },
            _submit: function () {
                axios.post(this.BASE_URL_PRODUTO + 'save', this.produto).then(
                    this._list
                ).catch(err => console.log(err))
                this.$v.$reset()
            },
            _edit: function (produto) {
                Object.keys(this.produto, produto).forEach(k => this.produto[k] = produto[k])
            },
            _delete: function (produto) {
                if (confirm('Você tem certeza que deseja excluir este produto?')) {
                    axios.delete(this.BASE_URL_PRODUTO + produto.id).then(
                        this._list
                    ).catch(err => console.log(err));
                }
            },
            validate(name) {
                const {$dirty, $error} = this.$v.produto[name];
                return $dirty ? !$error : null;
            }
        },
        validations: {
            produto: {
                nome: {required},
                descricao: {required},
                sku: {required},
                preco: {required, decimal},
                quantidade: {required, numeric}
            }
        },
        mounted: function () {
            this._list()
        }
    }
</script>

<style scoped>

</style>
