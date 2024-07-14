import {
  Client,
  ClientFilterParams,
  ERRORS,
  ListClientsRequest,
  ListClientsResponse,
  validateClient,
} from '@invoice-system/shared';
import { RequestHandler } from 'express';

import {
  createClient,
  deleteClient,
  findClients,
  getClientById,
  getClientByMobile,
  listClients,
  updateClient,
} from '../../datastore/models/client';
import { ExpressHandler, ExpressHandlerWithParams } from '../../types';
import { PAGE_SIZE } from '../../utils/constants';

const httpListClients: ExpressHandlerWithParams<
  ClientFilterParams,
  ListClientsRequest,
  ListClientsResponse
> = async (req, res) => {
  const params = req.query;

  const clients = await listClients({
    search: params.search,
    page: parseInt(params.page),
  });

  const hasNext = clients.length > PAGE_SIZE;
  const hasPrevious = req.query.page > 0;
  if (hasNext) clients.splice(-1);

  return res.status(200).send({ clients, hasNext, hasPrevious });
};

const httpGetClientById: ExpressHandlerWithParams<{ id: string }, Client, Client> = async (
  req,
  res
) => {
  const clientId = req.params.id;

  const client = await getClientById(+clientId!);
  if (!client) {
    return res.status(404).send({ message: ERRORS.MISSING_REQUIRED_FIELDS });
  }

  return res.status(200).send(client);
};

const httpCreateClient: ExpressHandler<Client, Client> = async (req, res) => {
  const mobile = req.body.mobile;

  const errMsg = validateClient({
    firstName: req.body.firstName + '',
    lastName: req.body.lastName + '',
    mobile: mobile + '',
  });

  if (errMsg) {
    return res.status(400).send({ message: errMsg });
  }

  const clientExists = await getClientByMobile(mobile + '');
  if (clientExists) {
    return res.status(409).send({ message: ERRORS.DUPLICATE_CLIENT });
  }

  const newClient = {
    mobile: req.body.mobile,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    middleName: req.body.middleName,
  };
  const clientID = await createClient(newClient);

  return res.status(201).send({ clientID, ...newClient });
};

const httpUpdateClient: ExpressHandlerWithParams<{ id: string }, Client, Client> = async (
  req,
  res
) => {
  const clientId = req.params.id;

  const client = await getClientById(+clientId!);
  if (!client) {
    return res.status(404).send({ message: ERRORS.CLIENT_NOT_FOUND });
  }

  const mobile = req.body.mobile;
  const clientExists = await getClientByMobile(mobile!);
  if (clientExists && clientExists.clientID !== client.clientID) {
    return res.status(404).send({ message: ERRORS.DUPLICATE_CLIENT });
  }

  await updateClient({ ...client, ...req.body });
  return res.status(200).send({ message: 'client updated successfully' });
};

const httpDeleteClient: ExpressHandlerWithParams<{ id: string }, null, {}> = async (req, res) => {
  const clientId = req.params.id;

  const deleted = await deleteClient(clientId!);

  if (!deleted) {
    return res.status(404).send({ message: ERRORS.CLIENT_NOT_FOUND });
  }

  return res.status(200).send({ message: 'client deleted' });
};

export { httpListClients, httpGetClientById, httpCreateClient, httpUpdateClient, httpDeleteClient };
